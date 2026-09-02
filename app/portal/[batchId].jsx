import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, MapPin, CalendarDays, History } from 'lucide-react-native';
import HiveModel3D from '../../src/features/portal/components/HiveModel3D';
import TipBeekeeper from '../../src/features/portal/components/TipBeekeeper';
import TastingRadar from '../../src/features/portal/components/TastingRadar';

// Wagmi & Viem Setup (Web Only safely)
let WagmiConfig, QueryClient, QueryClientProvider, createConfig, http, mainnet, polygon;

if (Platform.OS === 'web') {
  const wagmi = require('wagmi');
  const viemChains = require('wagmi/chains');
  const reactQuery = require('@tanstack/react-query');

  createConfig = wagmi.createConfig;
  http = wagmi.http;
  WagmiConfig = wagmi.WagmiProvider;
  mainnet = viemChains.mainnet;
  polygon = viemChains.polygon;
  QueryClient = reactQuery.QueryClient;
  QueryClientProvider = reactQuery.QueryClientProvider;
}

const queryClient = Platform.OS === 'web' ? new QueryClient() : null;
const wagmiConfig = Platform.OS === 'web' ? createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
}) : null;

function PortalContent({ batchId }) {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <ShieldCheck color="#10B981" size={20} />
          <Text style={styles.badgeText}>Verified by HoneyChain</Text>
        </View>
        <Text style={styles.title}>Honey Passport</Text>
        <Text style={styles.batchId}>Batch: {batchId || 'UNKNOWN'}</Text>
      </View>

      {/* AR / 3D Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactive Hive</Text>
        <Text style={styles.sectionSubtitle}>Swipe to rotate and view real-time data</Text>
        <HiveModel3D />
      </View>

      {/* Tasting Notes */}
      <TastingRadar />

      {/* Timeline */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <History color="#111827" size={20} />
          <Text style={styles.sectionTitle}>Journey Timeline</Text>
        </View>
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineIcon}><CalendarDays size={16} color="#fff" /></View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Harvested</Text>
            <Text style={styles.timelineDesc}>Oct 15, 2026 - Fall Wildflower Flow</Text>
          </View>
        </View>
        <View style={styles.timelineLine} />
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineIcon}><ShieldCheck size={16} color="#fff" /></View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Verified & Minted</Text>
            <Text style={styles.timelineDesc}>Oct 18, 2026 - Blockchain record created</Text>
          </View>
        </View>
        <View style={styles.timelineLine} />
        
        <View style={styles.timelineItem}>
          <View style={[styles.timelineIcon, { backgroundColor: '#FCD34D' }]}><MapPin size={16} color="#111827" /></View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Delivered to You</Text>
            <Text style={styles.timelineDesc}>Scan QR Code on Bottle</Text>
          </View>
        </View>
      </View>

      {/* Support Beekeeper */}
      <TipBeekeeper />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>HoneyChain Consumer Portal • 2026</Text>
      </View>
    </ScrollView>
  );
}

export default function PortalScreen() {
  const { batchId } = useLocalSearchParams();

  if (Platform.OS === 'web' && WagmiConfig && queryClient) {
    return (
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={styles.container}>
            <PortalContent batchId={batchId} />
          </SafeAreaView>
        </QueryClientProvider>
      </WagmiConfig>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PortalContent batchId={batchId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  batchId: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 15,
    marginVertical: 4,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
  }
});
