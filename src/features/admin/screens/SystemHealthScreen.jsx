import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Cpu, ArrowLeft, Activity, Database, CheckCircle2, RefreshCw, Layers, ShieldCheck, Wifi } from 'lucide-react-native';
import { auditService } from '../../../services/audit.service';

export default function SystemHealthScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System & IoT Telemetry Health</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
          <RefreshCw size={20} color={refreshing ? '#2563EB' : '#64748B'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gateway Health Overview */}
        <Text style={styles.sectionTitle}>Ecosystem Node Services</Text>

        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <Wifi size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.serviceName}>IoT Telemetry Gateways & MQTT Broker</Text>
              <Text style={styles.serviceSub}>42/42 Hives Connected • Latency: 12ms • 0% Packet Loss</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>ONLINE</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <Activity size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.serviceName}>HoneyChain FastAPI Backend Server</Text>
              <Text style={styles.serviceSub}>Port 8000 • Uvicorn Worker Active • Response: 18ms</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>HEALTHY</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <Layers size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.serviceName}>Polygon / Ethereum Blockchain RPC Node</Text>
              <Text style={styles.serviceSub}>Block #19,482,109 • Smart Contracts Synced</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>SYNCED</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <Database size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.serviceName}>Firebase Firestore Database</Text>
              <Text style={styles.serviceSub}>honeychain-40065 • 0 Throttled Requests</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Real-time System Audit Stream */}
        <Text style={styles.sectionTitle}>Live System Audit Trail</Text>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color="#2563EB" size="small" style={{ marginVertical: 20 }} />
          ) : logs.length === 0 ? (
            <Text style={styles.emptyText}>No recent audit log events recorded.</Text>
          ) : (
            logs.map((log, index) => (
              <View key={log.id || index} style={styles.logItem}>
                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.logAction}>{log.action || 'SYSTEM_EVENT'}</Text>
                  <Text style={styles.logMeta}>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
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
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  serviceSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  onlineBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 10,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  logMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
