import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Compass, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react-native';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { theme } from '../../../theme';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;

  const handleSelectRole = (role) => {
    router.push({
      pathname: '/(auth)/login',
      params: { role },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.contentWrapper, isTabletOrDesktop && styles.tabletContentWrapper]}>
          {/* Header */}
          <View style={styles.header}>
            <BrandLogo style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={styles.title}>Welcome to HoneyChain</Text>
            <Text style={styles.subtitle}>How do you want to use HoneyChain?</Text>
          </View>

          {/* Role Options */}
          <View style={[styles.cardGrid, isTabletOrDesktop && styles.tabletCardGrid]}>
            {/* Beekeeper Option */}
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleSelectRole('BEEKEEPER')}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.emojiIcon}>🐝</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.roleTitle}>Beekeeper & Producer</Text>
                <Text style={styles.roleDesc}>
                  Manage your apiaries, monitor IoT hive telemetry, log harvests, and mint blockchain honey passports.
                </Text>
              </View>
              <View style={styles.actionArrow}>
                <ArrowRight size={20} color="#D97706" />
              </View>
            </TouchableOpacity>

            {/* Customer Option */}
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleSelectRole('CUSTOMER')}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.emojiIcon}>🍯</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.roleTitle}>Customer & Buyer</Text>
                <Text style={styles.roleDesc}>
                  Discover artisanal honey, scan QR codes for on-chain provenance, and buy verified pure honey.
                </Text>
              </View>
              <View style={styles.actionArrow}>
                <ArrowRight size={20} color="#059669" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Trust Badge */}
          <View style={styles.trustFooter}>
            <ShieldCheck size={18} color="#64748B" />
            <Text style={styles.trustText}>On-Chain Provenance • Lab Quality Verified</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  tabletContentWrapper: {
    maxWidth: 720,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1A17',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7A7265',
    textAlign: 'center',
  },
  cardGrid: {
    gap: 16,
  },
  tabletCardGrid: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EBE1',
    elevation: 3,
    shadowColor: '#1F1A17',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1A17',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 13,
    color: '#7A7265',
    lineHeight: 18,
  },
  actionArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    gap: 8,
  },
  trustText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
});
