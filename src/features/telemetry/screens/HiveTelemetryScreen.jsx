import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ArrowLeft, Thermometer, Droplets, Activity, Battery, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import TopHeader from '../../../components/navigation/TopHeader';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function HiveTelemetryScreen() {
  const router = useRouter();
  const colors = useThemeColors();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Hive Telemetry & AI Health</Text>
            <Text style={[styles.screenSubtitle, { color: colors.subtext }]}>IoT Sensor Telemetry • Device: {telemetry.deviceId}</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} style={[styles.refreshBtn, { backgroundColor: colors.isDark ? '#3B2D05' : '#FFFDF0', borderColor: colors.isDark ? '#D97706' : theme.colors.primary }]}>
            <RefreshCw size={18} color={colors.isDark ? '#F59E0B' : theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* AI Varroa Mite Risk Alert Banner */}
        <View style={[styles.healthBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.healthScoreCircle, { backgroundColor: colors.isDark ? '#064E3B' : '#F0FFF4' }]}>
            <Text style={[styles.scoreNumber, { color: '#10B981' }]}>{telemetry.varroaScore}%</Text>
            <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Health</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.statusRow}>
              <ShieldCheck size={20} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={[styles.healthStatusTitle, { color: colors.text }]}>Varroa Mite Risk: Low</Text>
            </View>
            <Text style={[styles.healthDesc, { color: colors.subtext }]}>
              Acoustic frequency spectrum (240 Hz) matches healthy colony activity. AI acoustic model detects optimal queen piping & wing flutter.
            </Text>
          </View>
        </View>

        {/* Live Metrics Grid */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Live IoT Sensor Readings (Refreshed {lastRefreshed})</Text>
        <View style={styles.grid}>
          
          {/* Temperature */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.isDark ? '#450A0A' : '#FFF5F5' }]}>
              <Thermometer size={22} color="#E53E3E" />
            </View>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Temperature</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{telemetry.temperature}°C</Text>
            <Text style={[styles.metricSub, { color: colors.subtext }]}>Ideal: 34.0°C - 35.5°C</Text>
          </View>

          {/* Humidity */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.isDark ? '#1E3A8A' : '#EBF8FF' }]}>
              <Droplets size={22} color="#3182CE" />
            </View>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Humidity</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{telemetry.humidity}%</Text>
            <Text style={[styles.metricSub, { color: colors.subtext }]}>Optimal Brood: 55-65%</Text>
          </View>

          {/* Acoustic Frequency */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.isDark ? '#064E3B' : '#F0FFF4' }]}>
              <Activity size={22} color="#38A169" />
            </View>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Acoustic AI</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{telemetry.acousticFreq}</Text>
            <Text style={[styles.metricSub, { color: colors.subtext }]}>Queen Piping Verified</Text>
          </View>

          {/* Battery Status */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.isDark ? '#451A03' : '#FFFFF0' }]}>
              <Battery size={22} color="#D69E2E" />
            </View>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>IoT Battery</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{telemetry.battery}%</Text>
            <Text style={[styles.metricSub, { color: colors.subtext }]}>Solar Charging Active</Text>
          </View>

        </View>

        {/* Historical Trends Visual Representation */}
        <Text style={[styles.sectionHeader, { color: colors.text, marginTop: 24 }]}>24-Hour Telemetry Trend</Text>
        <View style={[styles.trendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.trendRow}>
            <Text style={[styles.trendDay, { color: colors.subtext }]}>00:00</Text>
            <View style={[styles.barBackground, { backgroundColor: colors.background }]}><View style={[styles.barFill, { width: '85%' }]} /></View>
            <Text style={[styles.trendVal, { color: colors.text }]}>34.2°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Text style={[styles.trendDay, { color: colors.subtext }]}>06:00</Text>
            <View style={[styles.barBackground, { backgroundColor: colors.background }]}><View style={[styles.barFill, { width: '88%' }]} /></View>
            <Text style={[styles.trendVal, { color: colors.text }]}>34.6°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Text style={[styles.trendDay, { color: colors.subtext }]}>12:00</Text>
            <View style={[styles.barBackground, { backgroundColor: colors.background }]}><View style={[styles.barFill, { width: '92%' }]} /></View>
            <Text style={[styles.trendVal, { color: colors.text }]}>35.1°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Text style={[styles.trendDay, { color: colors.subtext }]}>18:00</Text>
            <View style={[styles.barBackground, { backgroundColor: colors.background }]}><View style={[styles.barFill, { width: '90%' }]} /></View>
            <Text style={[styles.trendVal, { color: colors.text }]}>34.8°C</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 8, borderRadius: 20 },
  screenTitle: { fontSize: 20, fontWeight: '800' },
  screenSubtitle: { fontSize: 13 },
  refreshBtn: { padding: 10, borderRadius: 12, borderWidth: 1 },
  healthBanner: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, marginBottom: 20 },
  healthScoreCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  scoreNumber: { fontSize: 18, fontWeight: '800' },
  scoreLabel: { fontSize: 10, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  healthStatusTitle: { fontSize: 15, fontWeight: '700' },
  healthDesc: { fontSize: 12, lineHeight: 17 },
  sectionHeader: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '48%', borderRadius: 14, padding: 14, borderWidth: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  metricLabel: { fontSize: 12, fontWeight: '600' },
  metricValue: { fontSize: 20, fontWeight: '800', marginVertical: 2 },
  metricSub: { fontSize: 11 },
  trendCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trendDay: { width: 45, fontSize: 12, fontWeight: '600' },
  barBackground: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#D97706', borderRadius: 5 },
  trendVal: { width: 50, fontSize: 12, fontWeight: '700', textAlign: 'right' }
});
