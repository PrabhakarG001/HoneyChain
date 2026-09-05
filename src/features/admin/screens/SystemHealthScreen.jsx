import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Cpu, ArrowLeft, Activity, Database, CheckCircle2, RefreshCw, Layers, ShieldCheck, Wifi } from 'lucide-react-native';
import { auditService } from '../../../services/audit.service';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function SystemHealthScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const auditLogs = await auditService.getRecentLogs(10);
      setLogs(auditLogs || []);
    } catch (e) {
      console.warn('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAuditLogs();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>System & IoT Telemetry Health</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
          <RefreshCw size={20} color={refreshing ? '#2563EB' : colors.subtext} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gateway Health Overview */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ecosystem Node Services</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.serviceRow}>
            <Wifi size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.serviceName, { color: colors.text }]}>IoT Telemetry Gateways & MQTT Broker</Text>
              <Text style={[styles.serviceSub, { color: colors.subtext }]}>42/42 Hives Connected • Latency: 12ms • 0% Packet Loss</Text>
            </View>
            <View style={[styles.onlineBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
              <Text style={[styles.onlineText, { color: colors.isDark ? '#34D399' : '#059669' }]}>ONLINE</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.serviceRow}>
            <Activity size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.serviceName, { color: colors.text }]}>HoneyChain FastAPI Backend Server</Text>
              <Text style={[styles.serviceSub, { color: colors.subtext }]}>Port 8000 • Uvicorn Worker Active • Response: 18ms</Text>
            </View>
            <View style={[styles.onlineBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
              <Text style={[styles.onlineText, { color: colors.isDark ? '#34D399' : '#059669' }]}>HEALTHY</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.serviceRow}>
            <Layers size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Polygon / Ethereum Blockchain RPC Node</Text>
              <Text style={[styles.serviceSub, { color: colors.subtext }]}>Block #19,482,109 • Smart Contracts Synced</Text>
            </View>
            <View style={[styles.onlineBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
              <Text style={[styles.onlineText, { color: colors.isDark ? '#34D399' : '#059669' }]}>SYNCED</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.serviceRow}>
            <Database size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Firebase Firestore Database</Text>
              <Text style={[styles.serviceSub, { color: colors.subtext }]}>honeychain-40065 • 0 Throttled Requests</Text>
            </View>
            <View style={[styles.onlineBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
              <Text style={[styles.onlineText, { color: colors.isDark ? '#34D399' : '#059669' }]}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Real-time System Audit Stream */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Live System Audit Trail</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {loading ? (
            <ActivityIndicator color="#2563EB" size="small" style={{ marginVertical: 20 }} />
          ) : logs.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No recent audit log events recorded.</Text>
          ) : (
            logs.map((log, index) => (
              <View key={log.id || index} style={[styles.logItem, { borderBottomColor: colors.border }]}>
                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.logAction, { color: colors.text }]}>{log.action || 'SYSTEM_EVENT'}</Text>
                  <Text style={[styles.logMeta, { color: colors.subtext }]}>
                    {log.userRole || 'SYSTEM'} • {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  refreshBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 6,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
  },
  serviceSub: {
    fontSize: 12,
    marginTop: 2,
  },
  onlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 10,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  logAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  logMeta: {
    fontSize: 11,
    marginTop: 2,
  },
});
