import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Thermometer, Droplets, Activity, Cpu, ChevronLeft, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './HiveDetailsScreen.styles';

import HumanizedStat from '../../../components/ui/HumanizedStat/HumanizedStat';
import InsightCard from '../../../components/ui/InsightCard/InsightCard';
import EmptyState from '../../../components/ui/EmptyState/EmptyState';

export default function HiveDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [wsStatus, setWsStatus] = React.useState('Connecting...');
  const [telemetry, setTelemetry] = React.useState(null);

  const { data: hive, isLoading } = useQuery({
    queryKey: ['hive', id],
    queryFn: () => hiveService.getHive(id),
    enabled: !!id,
  });

  const { data: historyTelemetry } = useQuery({
    queryKey: ['hive-telemetry', id],
    queryFn: () => hiveService.getHiveTelemetry(id),
    enabled: !!id,
  });

  const { data: analysis } = useQuery({
    queryKey: ['hive-analysis', id],
    queryFn: () => hiveService.getHiveAnalysis(id),
    enabled: !!id,
  });

  // Use live telemetry if available, otherwise fallback to the most recent historical telemetry
  const displayTelemetry = telemetry || (historyTelemetry && historyTelemetry.length > 0 ? historyTelemetry[0] : null);
  const displayAnalysis = telemetry?.risk_analysis || analysis;

  React.useEffect(() => {
    if (!id) return;
    
    // Connect to actual backend WebSocket
    const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://127.0.0.1:8000';
    const ws = new WebSocket(`${wsUrl}/hives/${id}/live`);

    ws.onopen = () => {
      setWsStatus('Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTelemetry(data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      setWsStatus('Disconnected');
    };

    ws.onerror = () => {
      setWsStatus('Connection failure');
    };

    return () => {
      ws.close();
    };
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primaryDark} size="large" />
      </View>
    );
  }

  if (!hive) {
    return (
      <View style={styles.errorContainer}>
        <Text>Hive not found</Text>
      </View>
    );
  }

  const isGood = hive.healthStatus === 'GOOD';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/hive1/800/600' }} 
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <TouchableOpacity 
              style={[styles.backBtn, { top: insets.top + 10 }]}
              onPress={() => router.back()}
            >
              <ChevronLeft color={theme.colors.charcoal} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.hiveId}>{hive.id}</Text>
            <View style={[styles.statusBadge, wsStatus === 'Connected' ? styles.statusBadgeGood : styles.statusBadgeWarning]}>
              <View style={[styles.statusDot, wsStatus === 'Connected' ? styles.statusDotGood : styles.statusDotWarning]} />
              <Text style={styles.statusText}>
                {wsStatus}
              </Text>
            </View>
          </View>
          <Text style={styles.beeSpecies}>{hive.beeSpecies} • {displayTelemetry?.timestamp ? new Date(displayTelemetry.timestamp).toLocaleTimeString() : 'Waiting for telemetry...'}</Text>
        </View>

        {/* Edge to Edge Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          
          {displayTelemetry ? (
            <View style={styles.dataContainer}>
              <HumanizedStat 
                icon={Thermometer}
                value={`${(displayTelemetry.temperature_c || displayTelemetry.temperature || 0).toFixed(1)}°C`}
                description="Temperature inside the hive."
                color={theme.colors.status.warning}
              />
              <HumanizedStat 
                icon={Droplets}
                value={`${(displayTelemetry.humidity_pct || displayTelemetry.humidity || 0).toFixed(1)}%`}
                description="Humidity inside the hive."
                color={theme.colors.status.info}
              />
              <HumanizedStat 
                icon={Activity}
                value={`${(displayTelemetry.weight_kg || displayTelemetry.weight || 0).toFixed(2)} kg`}
                description="Current weight of the hive."
                color={theme.colors.status.success}
              />
              
              <View style={styles.deviceFooter}>
                <Cpu size={16} color={theme.colors.text.muted} />
                <Text style={styles.deviceText}>Live updates connected</Text>
              </View>
            </View>
          ) : wsStatus === 'Disconnected' || wsStatus === 'Connection failure' ? (
            <EmptyState 
              title="No Telemetry Received" 
              message="The connection to the hive sensors was lost or could not be established."
              actionLabel="Reconnect"
              onAction={() => setWsStatus('Connecting...')}
            />
          ) : (
            <EmptyState 
              title="Waiting for Telemetry..." 
              message="Please wait while we receive the first sensor reading from the hive."
              actionLabel="Connecting..."
              onAction={() => {}}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insight</Text>
          {displayAnalysis && displayAnalysis.status !== "No Data" ? (
             <InsightCard 
               title={`Risk Analysis: ${displayAnalysis.status}`} 
               insight={`Confidence Score: ${(displayAnalysis.risk_score * 100 || 0).toFixed(0)}%. ${displayAnalysis.highest_contributor && displayAnalysis.highest_contributor !== 'None' ? `Highest contributor to risk: ${displayAnalysis.highest_contributor}.` : 'Conditions look optimal.'}`} 
             />
          ) : (
             <Text style={{ marginTop: 12, color: theme.colors.text.secondary }}>AI analysis unavailable or awaiting data</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityRow}>
            <View style={styles.activityIcon}>
              <Calendar size={18} color={theme.colors.text.secondary} />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Routine Inspection</Text>
              <Text style={styles.activityTime}>Yesterday at 10:00 AM</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
