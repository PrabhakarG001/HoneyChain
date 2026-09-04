import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ArrowLeft, Thermometer, Droplets, Activity, Battery, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import TopHeader from '../../../components/navigation/TopHeader';

export default function HiveTelemetryScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  // Real-time & Historical Telemetry State
  const [telemetry, setTelemetry] = useState({
    temperature: 34.8,
    humidity: 62.4,
    acousticFreq: '240 Hz',
    varroaRisk: 'Low',
    varroaScore: 94,
    battery: 88,
    status: 'Online',
    deviceId: 'IOT_GATEWAY_01'
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTelemetry(prev => ({
        ...prev,
        temperature: +(34.5 + Math.random() * 0.8).toFixed(1),
        humidity: +(60 + Math.random() * 5).toFixed(1),
        battery: Math.max(20, prev.battery - 1)
      }));
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={theme.colors.charcoal} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Hive Telemetry & AI Health</Text>
            <Text style={styles.screenSubtitle}>IoT Sensor Telemetry • Device: {telemetry.deviceId}</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
            <RefreshCw size={18} color={theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* AI Varroa Mite Risk Alert Banner */}
        <View style={styles.healthBanner}>
          <View style={styles.healthScoreCircle}>
            <Text style={styles.scoreNumber}>{telemetry.varroaScore}%</Text>
            <Text style={styles.scoreLabel}>Health</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.statusRow}>
              <ShieldCheck size={20} color={theme.colors.status.success} style={{ marginRight: 6 }} />
              <Text style={styles.healthStatusTitle}>Varroa Mite Risk: Low</Text>
            </View>
            <Text style={styles.healthDesc}>
              Acoustic frequency spectrum (240 Hz) matches healthy colony activity. AI acoustic model detects optimal queen piping & wing flutter.
            </Text>
          </View>
        </View>

        {/* Live Metrics Grid */}
        <Text style={styles.sectionHeader}>Live IoT Sensor Readings (Refreshed {lastRefreshed})</Text>
        <View style={styles.grid}>
          
          {/* Temperature */}
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF5F5' }]}>
              <Thermometer size={22} color="#E53E3E" />
            </View>
            <Text style={styles.metricLabel}>Temperature</Text>
            <Text style={styles.metricValue}>{telemetry.temperature}°C</Text>
            <Text style={styles.metricSub}>Ideal: 34.0°C - 35.5°C</Text>
          </View>

          {/* Humidity */}
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: '#EBF8FF' }]}>
              <Droplets size={22} color="#3182CE" />
            </View>
            <Text style={styles.metricLabel}>Humidity</Text>
            <Text style={styles.metricValue}>{telemetry.humidity}%</Text>
            <Text style={styles.metricSub}>Optimal Brood: 55-65%</Text>
          </View>

          {/* Acoustic Frequency */}
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FFF4' }]}>
              <Activity size={22} color="#38A169" />
            </View>
            <Text style={styles.metricLabel}>Acoustic AI</Text>
            <Text style={styles.metricValue}>{telemetry.acousticFreq}</Text>
            <Text style={styles.metricSub}>Queen Piping Verified</Text>
          </View>

          {/* Battery Status */}
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FFFFF0' }]}>
              <Battery size={22} color="#D69E2E" />
            </View>
            <Text style={styles.metricLabel}>IoT Battery</Text>
            <Text style={styles.metricValue}>{telemetry.battery}%</Text>
            <Text style={styles.metricSub}>Solar Charging Active</Text>
          </View>

        </View>

        {/* Historical Trends Visual Representation */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>24-Hour Telemetry Trend</Text>
        <View style={styles.trendCard}>
          <View style={styles.trendRow}>
            <Text style={styles.trendDay}>00:00</Text>
            <View style={styles.barBackground}><View style={[styles.barFill, { width: '85%' }]} /></View>
            <Text style={styles.trendVal}>34.2°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Text style={styles.trendDay}>06:00</Text>
            <View style={styles.barBackground}><View style={[styles.barFill, { width: '88%' }]} /></View>
            <Text style={styles.trendVal}>34.6°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Text style={styles.trendDay}>12:00</Text>
            <View style={styles.barBackground}><View style={[styles.barFill, { width: '92%' }]} /></View>
            <Text style={styles.trendVal}>35.1°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Text style={styles.trendDay}>18:00</Text>
            <View style={styles.barBackground}><View style={[styles.barFill, { width: '90%' }]} /></View>
            <Text style={styles.trendVal}>34.8°C</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.main },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 8, borderRadius: 20, backgroundColor: theme.colors.background.card },
  screenTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.charcoal },
  screenSubtitle: { fontSize: 13, color: theme.colors.text.secondary },
  refreshBtn: { padding: 10, borderRadius: 12, backgroundColor: '#FFFDF0', borderWidth: 1, borderColor: theme.colors.primary },
  healthBanner: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 20 },
  healthScoreCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0FFF4', borderWidth: 3, borderColor: theme.colors.status.success, alignItems: 'center', justifyContent: 'center' },
  scoreNumber: { fontSize: 18, fontWeight: '800', color: theme.colors.status.success },
  scoreLabel: { fontSize: 10, color: theme.colors.text.secondary, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  healthStatusTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.charcoal },
  healthDesc: { fontSize: 12, color: theme.colors.text.secondary, lineHeight: 17 },
  sectionHeader: { fontSize: 15, fontWeight: '700', color: theme.colors.charcoal, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: theme.colors.border },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  metricLabel: { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '600' },
  metricValue: { fontSize: 20, fontWeight: '800', color: theme.colors.charcoal, marginVertical: 2 },
  metricSub: { fontSize: 11, color: theme.colors.text.muted },
  trendCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 10 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trendDay: { width: 45, fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  barBackground: { flex: 1, height: 10, backgroundColor: '#F7FAFC', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: theme.colors.primaryDark, borderRadius: 5 },
  trendVal: { width: 50, fontSize: 12, fontWeight: '700', color: theme.colors.charcoal, textAlign: 'right' }
});
