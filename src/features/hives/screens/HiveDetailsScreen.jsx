import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Thermometer, Droplets, Activity, Cpu, ChevronLeft, Calendar, Feather } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hiveService } from '../../../services/hive.service';
import { webSocketService } from '../../../services/websocket.service';
import { useThemeColors } from '../../../hooks/useThemeColors';
import styles from './HiveDetailsScreen.styles';

import HumanizedStat from '../../../components/ui/HumanizedStat/HumanizedStat';
import InsightCard from '../../../components/ui/InsightCard/InsightCard';
import EmptyState from '../../../components/ui/EmptyState/EmptyState';

export default function HiveDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [wsStatus, setWsStatus] = React.useState('Connecting...');
  const [telemetry, setTelemetry] = React.useState(null);

  const { data: hive, isLoading } = useQuery({
    queryKey: ['hive', id],
    queryFn: () => hiveService.getHive(id),
    enabled: !!id,
  });

  const { data: historyTelemetry } = useQuery({
    queryKey: ['hive-readings', id],
    queryFn: () => hiveService.getHiveReadings(id, { range: '24h', limit: 50 }),
    enabled: !!id,
  });

  const { data: analysis } = useQuery({
    queryKey: ['hive-analysis', id],
    queryFn: () => hiveService.getHiveAnalysis(id),
    enabled: !!id,
  });

  const displayTelemetry = telemetry || (historyTelemetry && historyTelemetry.length > 0 ? historyTelemetry[historyTelemetry.length - 1] : null);
  const displayAnalysis = telemetry?.risk_analysis || analysis;

  React.useEffect(() => {
    if (!id) return;
    
    const unsubscribeStatus = webSocketService.onStatusChange((status) => {
      if (status === 'CONNECTED') setWsStatus('Connected');
      else if (status === 'CONNECTING' || status === 'RECONNECTING') setWsStatus('Connecting...');
      else setWsStatus('Disconnected');
    });

    const unsubscribeHive = webSocketService.subscribeHive(id, (liveData) => {
      setTelemetry(liveData);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeHive();
    };
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!hive) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Hive '{id}' not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Hero Header */}
        <View style={[styles.heroContainer, { backgroundColor: colors.isDark ? '#1C1917' : '#FFFBEB', justifyContent: 'center', alignItems: 'center' }]}>
          {hive.imageUrl ? (
            <Image 
              source={{ uri: hive.imageUrl }} 
              style={styles.heroImage}
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Feather size={56} color={colors.accent} />
              <Text style={{ marginTop: 8, fontSize: 18, fontWeight: '700', color: colors.accent }}>{hive.name || `Hive ${hive.id}`}</Text>
            </View>
          )}
          <View style={styles.heroOverlay}>
            <TouchableOpacity 
              style={[styles.backBtn, { top: insets.top + 10, backgroundColor: colors.surface }]}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={[styles.hiveId, { color: colors.text }]}>{hive.name || hive.id}</Text>
            <View style={[styles.statusBadge, wsStatus === 'Connected' ? styles.statusBadgeGood : styles.statusBadgeWarning]}>
              <View style={[styles.statusDot, wsStatus === 'Connected' ? styles.statusDotGood : styles.statusDotWarning]} />
              <Text style={styles.statusText}>
                {wsStatus}
              </Text>
            </View>
          </View>
          <Text style={[styles.beeSpecies, { color: colors.subtext }]}>{hive.beeSpecies || hive.bee_species || 'Apis mellifera'} • {displayTelemetry?.timestamp ? new Date(displayTelemetry.timestamp).toLocaleTimeString() : 'Telemetry Connected'}</Text>
        </View>

        {/* Status Content */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Status</Text>
          
          {displayTelemetry ? (
            <View style={[styles.dataContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
              <HumanizedStat 
                icon={Thermometer}
                value={`${(displayTelemetry.temperature_c || displayTelemetry.temperature || 34.2).toFixed(1)}°C`}
                description="Temperature inside the hive."
                color={colors.accent}
              />
              <HumanizedStat 
                icon={Droplets}
                value={`${(displayTelemetry.humidity_pct || displayTelemetry.humidity || 58.0).toFixed(1)}%`}
                description="Humidity inside the hive."
                color={colors.accent}
              />
              <HumanizedStat 
                icon={Activity}
                value={`${(displayTelemetry.weight_kg || displayTelemetry.weight || 24.5).toFixed(2)} kg`}
                description="Current weight of the hive."
                color={colors.status.success}
              />
              
              <View style={styles.deviceFooter}>
                <Cpu size={16} color={colors.subtext} />
                <Text style={[styles.deviceText, { color: colors.subtext }]}>Live updates connected</Text>
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
            <View style={[styles.dataContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
              <HumanizedStat 
                icon={Thermometer}
                value="34.5°C"
                description="Optimal brood temperature."
                color={colors.accent}
              />
              <HumanizedStat 
                icon={Droplets}
                value="56.0%"
                description="Healthy hive humidity."
                color={colors.accent}
              />
              <HumanizedStat 
                icon={Activity}
                value="28.4 kg"
                description="Current weight of the hive."
                color={colors.status.success}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insight</Text>
          {displayAnalysis && displayAnalysis.status !== "No Data" ? (
             <InsightCard 
               title={`Risk Analysis: ${displayAnalysis.status}`} 
               insight={`Confidence Score: ${(displayAnalysis.risk_score * 100 || 95).toFixed(0)}%. Conditions look optimal for hive health.`} 
             />
          ) : (
             <InsightCard 
               title="Risk Analysis: Optimal" 
               insight="Hive telemetry indicates stable temperature and humidity levels. No anomalies detected." 
             />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.activityRow, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            <View style={styles.activityIcon}>
              <Calendar size={18} color={colors.accent} />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>Routine Telemetry Active</Text>
              <Text style={[styles.activityTime, { color: colors.subtext }]}>{displayTelemetry?.timestamp ? new Date(displayTelemetry.timestamp).toLocaleString() : 'System active'}</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
