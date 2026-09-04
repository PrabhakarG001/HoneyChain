import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// React Icons
import { FaMicrochip, FaWaveSquare, FaFileContract } from 'react-icons/fa';
import { WiThermometer, WiHumidity } from 'react-icons/wi';
import { MdVerified } from 'react-icons/md';
import { SiEthereum } from 'react-icons/si';

import { theme } from '../../../theme';

export default function ProtocolOverview({ onConnectHive, onViewPassports }) {
  const router = useRouter();

  const handleConnectHive = () => {
    if (onConnectHive) {
      onConnectHive();
    } else {
      router.push('/hives/add');
    }
  };

  const handleViewPassports = () => {
    if (onViewPassports) {
      onViewPassports();
    } else {
      router.push('/(app)/(tabs)/explore');
    }
  };

  return (
    <View style={styles.container}>
      {/* Live System Metrics Bar */}
      <View style={styles.metricsBar}>
        <View style={styles.metricItem}>
          <View style={styles.statusDotActive} />
          <Text style={styles.metricLabel}>Network Status</Text>
          <Text style={styles.metricValueConnected}>Connected</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Active Hives</Text>
          <Text style={styles.metricValue}>24</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Batches Verified</Text>
          <Text style={styles.metricValue}>1,284</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Latest Batch</Text>
          <Text style={styles.metricValueMonospace}>HC-2026-0842</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Last IoT Sync</Text>
          <Text style={styles.metricValue}>32 sec ago</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.badgeContainer}>
          <SiEthereum size={12} color="#B87A22" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>HoneyChain Protocol v2.4</Text>
        </View>

        <Text style={styles.heroTitle}>
          Track every batch. Verify every hive.
        </Text>

        <Text style={styles.heroSubtitle}>
          Connect your IoT-enabled hives, monitor hive conditions in real time, and create tamper-resistant honey provenance records on-chain.
        </Text>

        {/* CTA Buttons */}
        <View style={styles.ctaGroup}>
          <TouchableOpacity 
            style={styles.primaryCta} 
            onPress={handleConnectHive}
            activeOpacity={0.85}
          >
            <FaMicrochip size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryCtaText}>Connect Hive</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryCta} 
            onPress={handleViewPassports}
            activeOpacity={0.85}
          >
            <FaFileContract size={14} color={theme.colors.charcoal} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryCtaText}>View Batch Passports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature Cards Grid */}
      <View style={styles.featuresGrid}>
        {/* Card 1: Blockchain Passports */}
        <View style={styles.featureCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <FaFileContract size={18} color="#B87A22" />
            </View>
            <Text style={styles.cardTitle}>Blockchain Passports</Text>
          </View>
          <Text style={styles.cardDescription}>
            Timestamped and verifiable honey batch records secured by smart contracts.
          </Text>
        </View>

        {/* Card 2: Hive Telemetry */}
        <View style={styles.featureCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <FaMicrochip size={18} color="#B87A22" />
            </View>
            <Text style={styles.cardTitle}>Hive Telemetry</Text>
          </View>
          <Text style={styles.cardDescription}>
            Monitor temperature, humidity, and hive sound data from connected IoT devices.
          </Text>

          <View style={styles.telemetryIndicators}>
            <View style={styles.telemetryBadge}>
              <WiThermometer size={16} color="#7A7265" />
              <Text style={styles.telemetryBadgeText}>Temp</Text>
            </View>
            <View style={styles.telemetryBadge}>
              <WiHumidity size={16} color="#7A7265" />
              <Text style={styles.telemetryBadgeText}>Humidity</Text>
            </View>
            <View style={styles.telemetryBadge}>
              <FaWaveSquare size={12} color="#7A7265" />
              <Text style={styles.telemetryBadgeText}>Acoustic</Text>
            </View>
          </View>
        </View>

        {/* Card 3: On-Chain Verification */}
        <View style={styles.featureCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <MdVerified size={20} color="#B87A22" />
            </View>
            <Text style={styles.cardTitle}>On-Chain Verification</Text>
          </View>
          <Text style={styles.cardDescription}>
            Verify batch history and provenance without relying on a centralized database.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  metricsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EBE1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDotActive: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#5B7B6A',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7A7265',
  },
  metricValueConnected: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B7B6A',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F1A17',
  },
  metricValueMonospace: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
    color: '#B87A22',
  },
  metricDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#F0EBE1',
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EBE1',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FAEDCD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B87A22',
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1A17',
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#7A7265',
    marginBottom: 20,
    maxWidth: 680,
  },
  ctaGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B87A22',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4CFC6',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
  },
  secondaryCtaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1A17',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EBE1',
    borderRadius: 10,
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FAEDCD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1A17',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#7A7265',
  },
  telemetryIndicators: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderWidth: 1,
    borderColor: '#F0EBE1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  telemetryBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7A7265',
  },
});
