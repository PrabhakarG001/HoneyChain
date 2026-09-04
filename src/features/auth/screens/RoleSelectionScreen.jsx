import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShieldCheck, ArrowRight, Globe, Sparkles } from 'lucide-react-native';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';
import AuthBackground from '../components/AuthBackground';
import HoneycombDecoration from '../components/HoneycombDecoration';
import MolecularDecoration from '../components/MolecularDecoration';
import MicroElementsDecoration from '../components/MicroElementsDecoration';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useTranslation } from '../../../hooks/useTranslation';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t, currentLanguage } = useTranslation();
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleSelectRole = (role) => {
    router.push({
      pathname: '/(auth)/login',
      params: { role },
    });
  };

  return (
    <AuthBackground style={{ flex: 1 }}>
      {/* Decorative Bottom Left Honeycomb Structure */}
      <HoneycombDecoration width={width} />

      {/* Decorative Bottom Right Molecular Chemical Structure */}
      <MolecularDecoration width={width} />

      {/* Subtle Micro Floating Particles and Curved Accents */}
      <MicroElementsDecoration width={width} />

      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        {/* Top Header Row with Language Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[
              styles.langBtn, 
              { 
                backgroundColor: colors.isDark ? 'rgba(22, 24, 30, 0.85)' : 'rgba(255, 255, 255, 0.9)', 
                borderColor: colors.isDark ? 'rgba(244, 185, 66, 0.25)' : colors.border 
              }
            ]}
            onPress={() => setIsLangModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Select language"
          >
            <Globe size={16} color={colors.accent} />
            <Text style={[styles.langBtnText, { color: colors.text }]}>{currentLanguage.native}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.contentWrapper, isTabletOrDesktop && styles.tabletContentWrapper]}>
            
            {/* Honey & Bee Brand Hero Header */}
            <View style={styles.header}>
              <View style={[styles.beeBadge, { backgroundColor: colors.isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7', borderColor: colors.accent + '44' }]}>
                <Sparkles size={14} color={colors.accent} />
                <Text style={[styles.beeBadgeText, { color: colors.accent }]}>🐝 Pure Honey Provenance & Smart Apiary Ecosystem</Text>
              </View>

              <BrandLogo style={{ alignSelf: 'center', marginBottom: 16 }} iconSize={48} />
              <Text style={[styles.title, { color: colors.text }]}>{t('welcome', 'Welcome to HoneyChain')}</Text>
              <Text style={[styles.subtitle, { color: colors.subtext }]}>{t('roleTitle', 'Choose your role to get started')}</Text>
            </View>

            {/* Role Options */}
            <View style={[styles.cardGrid, isTabletOrDesktop && styles.tabletCardGrid]}>
              {/* Beekeeper Option */}
              <Pressable
                onHoverIn={() => setHoveredRole('BEEKEEPER')}
                onHoverOut={() => setHoveredRole(null)}
                onPress={() => handleSelectRole('BEEKEEPER')}
                style={({ pressed }) => [
                  styles.roleCard,
                  {
                    backgroundColor: colors.isDark ? '#16181E' : '#FFFFFF',
                    borderColor: (hoveredRole === 'BEEKEEPER' || pressed) 
                      ? colors.accent 
                      : colors.border,
                    shadowColor: (hoveredRole === 'BEEKEEPER' || pressed)
                      ? colors.accent
                      : colors.isDark ? '#000000' : '#1F1A17',
                    shadowOpacity: (hoveredRole === 'BEEKEEPER' || pressed) ? 0.25 : 0.08,
                    shadowRadius: (hoveredRole === 'BEEKEEPER' || pressed) ? 14 : 10,
                    transform: [{ scale: pressed ? 0.985 : (hoveredRole === 'BEEKEEPER' ? 1.015 : 1) }],
                  }
                ]}
                accessibilityRole="button"
                accessibilityLabel="Select Beekeeper and Producer role"
              >
                <View style={[styles.iconBox, { backgroundColor: colors.isDark ? 'rgba(244, 185, 66, 0.2)' : '#FEF3C7' }]}>
                  <Text style={styles.emojiIcon}>🐝</Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.roleHeaderRow}>
                    <Text style={[styles.roleTitle, { color: colors.text }]}>{t('beekeeperRoleTitle', 'Beekeeper & Producer')}</Text>
                    <View style={[styles.rolePill, { backgroundColor: colors.accent + '22' }]}>
                      <Text style={[styles.rolePillText, { color: colors.accent }]}>Apiary IoT</Text>
                    </View>
                  </View>
                  <Text style={[styles.roleDesc, { color: colors.subtext }]}>
                    {t('beekeeperRoleDesc', 'Manage your apiaries, monitor IoT hive telemetry, log harvests, and mint blockchain honey passports.')}
                  </Text>
                </View>
                <View style={[
                  styles.actionArrow, 
                  { 
                    backgroundColor: (hoveredRole === 'BEEKEEPER') ? colors.accent : (colors.isDark ? '#27272A' : '#F8FAFC') 
                  }
                ]}>
                  <ArrowRight size={20} color={(hoveredRole === 'BEEKEEPER') ? '#000000' : colors.accent} />
                </View>
              </Pressable>

              {/* Customer Option */}
              <Pressable
                onHoverIn={() => setHoveredRole('CUSTOMER')}
                onHoverOut={() => setHoveredRole(null)}
                onPress={() => handleSelectRole('CUSTOMER')}
                style={({ pressed }) => [
                  styles.roleCard,
                  {
                    backgroundColor: colors.isDark ? '#16181E' : '#FFFFFF',
                    borderColor: (hoveredRole === 'CUSTOMER' || pressed) 
                      ? colors.accent 
                      : colors.border,
                    shadowColor: (hoveredRole === 'CUSTOMER' || pressed)
                      ? colors.accent
                      : colors.isDark ? '#000000' : '#1F1A17',
                    shadowOpacity: (hoveredRole === 'CUSTOMER' || pressed) ? 0.25 : 0.08,
                    shadowRadius: (hoveredRole === 'CUSTOMER' || pressed) ? 14 : 10,
                    transform: [{ scale: pressed ? 0.985 : (hoveredRole === 'CUSTOMER' ? 1.015 : 1) }],
                  }
                ]}
                accessibilityRole="button"
                accessibilityLabel="Select Customer and Buyer role"
              >
                <View style={[styles.iconBox, { backgroundColor: colors.isDark ? 'rgba(244, 185, 66, 0.2)' : '#FEF3C7' }]}>
                  <Text style={styles.emojiIcon}>🍯</Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.roleHeaderRow}>
                    <Text style={[styles.roleTitle, { color: colors.text }]}>{t('customerRoleTitle', 'Customer & Buyer')}</Text>
                    <View style={[styles.rolePill, { backgroundColor: colors.accent + '22' }]}>
                      <Text style={[styles.rolePillText, { color: colors.accent }]}>Verified Honey</Text>
                    </View>
                  </View>
                  <Text style={[styles.roleDesc, { color: colors.subtext }]}>
                    {t('customerRoleDesc', 'Discover artisanal honey, scan QR codes for on-chain provenance, and buy verified pure honey.')}
                  </Text>
                </View>
                <View style={[
                  styles.actionArrow, 
                  { 
                    backgroundColor: (hoveredRole === 'CUSTOMER') ? colors.accent : (colors.isDark ? '#27272A' : '#F8FAFC') 
                  }
                ]}>
                  <ArrowRight size={20} color={(hoveredRole === 'CUSTOMER') ? '#000000' : colors.accent} />
                </View>
              </Pressable>
            </View>

            {/* Trust Footer */}
            <View style={styles.trustFooter}>
              <ShieldCheck size={18} color={colors.accent} />
              <Text style={[styles.trustText, { color: colors.subtext }]}>{t('onChainTrust', 'On-Chain Provenance • Lab Quality Verified')}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Language Selection Modal */}
        <LanguageModal 
          isVisible={isLangModalVisible} 
          onClose={() => setIsLangModalVisible(false)} 
        />
      </SafeAreaView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: 'flex-end',
    zIndex: 15,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '700',
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
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  cardGrid: {
    gap: 16,
  },
  tabletCardGrid: {
    gap: 20,
  },
  roleCard: {
    borderRadius: 20,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 3,
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
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  beeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    fontWeight: '500',
  },
});
