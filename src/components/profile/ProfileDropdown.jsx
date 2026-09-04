import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Modal, 
  TouchableWithoutFeedback, ScrollView, Dimensions 
} from 'react-native';
import { 
  User, Edit3, ShieldCheck, LogOut, QrCode, Award, 
  Sparkles, Box, ChevronRight, Copy, Check, 
  Bell, RefreshCw, X, CheckCircle2, Zap, Sun, Moon, Smartphone
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';
import { useThemeColors } from '../../hooks/useThemeColors';
import UserAvatar from '../ui/UserAvatar/UserAvatar';
import VerificationBadge from '../ui/VerificationBadge/VerificationBadge';

const ROLES = [
  { id: 'Beekeeper', label: 'Beekeeper 🐝', desc: 'Manage apiaries & harvests' },
  { id: 'Customer', label: 'Customer 🍯', desc: 'Buy pure verified honey' },
  { id: 'Inspector', label: 'Inspector 🔍', desc: 'Audit quality & labs' }
];

const THEME_OPTIONS = [
  { id: 'system', label: 'Auto', Icon: Smartphone },
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon }
];

export default function ProfileDropdown({ isVisible, onClose, onOpenEditProfile, onOpenLogout }) {
  const { user, updateUser } = useAuthStore();
  const { themeMode, setThemeMode } = useThemeStore();
  const router = useRouter();
  const colors = useThemeColors();

  const [copiedWallet, setCopiedWallet] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  if (!isVisible) return null;

  const currentRole = user?.role || 'Beekeeper';

  const handleNavigate = (path) => {
    onClose();
    router.push(path);
  };

  const handleCopyWallet = () => {
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 1500);
  };

  const handleSwitchRole = (newRole) => {
    updateUser({ role: newRole });
    setShowRoleSelector(false);
  };

  const userEmail = user?.email || 'user@honeychain.app';
  const displayWallet = user?.walletAddress || `0x71C...${(user?.uid || '89A4').slice(-4)}`;

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.popoverCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              
              {/* Header Close & Title */}
              <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
                <View style={styles.headerTitleRow}>
                  <Sparkles size={18} color={colors.accent} />
                  <Text style={[styles.headerTitle, { color: colors.text }]}>Profile Hub</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={[styles.iconCloseBtn, { backgroundColor: colors.surface }]}>
                  <X size={18} color={colors.subtext} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
                
                {/* Profile Identity Card */}
                <TouchableOpacity 
                  style={[styles.identityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => handleNavigate('/(app)/(tabs)/profile')}
                  activeOpacity={0.85}
                >
                  <View style={styles.avatarWrap}>
                    <UserAvatar user={user} size={56} />
                    <View style={styles.roleBadgeContainer}>
                      <VerificationBadge type="blockchain" text={currentRole} size="small" />
                    </View>
                  </View>

                  <View style={styles.identityDetails}>
                    <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                      {user?.displayName || user?.name || user?.username || 'HoneyChain Member'}
                    </Text>
                    <Text style={[styles.userEmail, { color: colors.subtext }]} numberOfLines={1}>
                      {userEmail}
                    </Text>

                    {/* Web3 Passport Snippet */}
                    <TouchableOpacity style={styles.walletSnippet} onPress={handleCopyWallet} activeOpacity={0.7}>
                      <Text style={[styles.walletText, { color: colors.subtext }]}>{displayWallet}</Text>
                      {copiedWallet ? (
                        <Check size={12} color={colors.accent} />
                      ) : (
                        <Copy size={12} color={colors.subtext} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <ChevronRight size={18} color={colors.subtext} />
                </TouchableOpacity>

                {/* Appearance / Theme Switcher Card */}
                <View style={[styles.sectionBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.boxTitle, { color: colors.subtext }]}>THEME MODE</Text>
                  <View style={styles.themeToggleRow}>
                    {THEME_OPTIONS.map(({ id, label, Icon }) => {
                      const isSelected = themeMode === id;
                      return (
                        <TouchableOpacity
                          key={id}
                          style={[
                            styles.themePill,
                            { 
                              backgroundColor: isSelected ? colors.accent : colors.background,
                              borderColor: isSelected ? colors.accent : colors.border
                            }
                          ]}
                          onPress={() => setThemeMode(id)}
                        >
                          <Icon size={14} color={isSelected ? '#000000' : colors.text} />
                          <Text style={[styles.themePillText, { color: isSelected ? '#000000' : colors.text }]}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Role Switcher Pill */}
                <View style={[styles.roleSwitchCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.roleSwitchHeader}>
                    <View style={styles.rowAlign}>
                      <Zap size={16} color={colors.accent} />
                      <Text style={[styles.roleLabel, { color: colors.text }]}>Role: {currentRole}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowRoleSelector(!showRoleSelector)}
                      style={[styles.switchToggleBtn, { backgroundColor: colors.accent + '22' }]}
                    >
                      <RefreshCw size={12} color={colors.accent} />
                      <Text style={[styles.switchToggleText, { color: colors.accent }]}>Switch Role</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Expanded Role Options */}
                  {showRoleSelector && (
                    <View style={styles.roleOptionsList}>
                      {ROLES.map((r) => {
                        const isSelected = r.id === currentRole;
                        return (
                          <TouchableOpacity
                            key={r.id}
                            style={[
                              styles.roleItem,
                              { backgroundColor: colors.background, borderColor: isSelected ? colors.accent : colors.border }
                            ]}
                            onPress={() => handleSwitchRole(r.id)}
                          >
                            <View style={styles.roleTextGroup}>
                              <Text style={[styles.roleTitle, { color: colors.text }]}>{r.label}</Text>
                              <Text style={[styles.roleDesc, { color: colors.subtext }]}>{r.desc}</Text>
                            </View>
                            {isSelected && <CheckCircle2 size={16} color={colors.accent} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* Quick HoneyChain Stats */}
                <View style={[styles.quickStatsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TouchableOpacity style={styles.quickStatItem} onPress={() => handleNavigate('/(app)/(tabs)/profile')}>
                    <Text style={[styles.quickStatNum, { color: colors.accent }]}>100%</Text>
                    <Text style={[styles.quickStatLabel, { color: colors.subtext }]}>Purity Score</Text>
                  </TouchableOpacity>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <TouchableOpacity style={styles.quickStatItem} onPress={() => handleNavigate('/(app)/(tabs)/profile')}>
                    <Text style={[styles.quickStatNum, { color: colors.text }]}>12</Text>
                    <Text style={[styles.quickStatLabel, { color: colors.subtext }]}>Verifications</Text>
                  </TouchableOpacity>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <TouchableOpacity style={styles.quickStatItem} onPress={() => handleNavigate('/(app)/(tabs)/profile')}>
                    <Text style={[styles.quickStatNum, { color: colors.text }]}>Verified</Text>
                    <Text style={[styles.quickStatLabel, { color: colors.subtext }]}>Web3 Pass</Text>
                  </TouchableOpacity>
                </View>

                {/* Section 1: All Profile Actions */}
                <Text style={[styles.sectionTitle, { color: colors.subtext }]}>ACCOUNT & PROFILE</Text>
                
                <TouchableOpacity 
                  style={[styles.menuRow, { borderBottomColor: colors.border }]}
                  onPress={() => handleNavigate('/(app)/(tabs)/profile')}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: colors.surface }]}>
                    <User size={18} color={colors.accent} />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuMainText, { color: colors.text }]}>View Full Profile</Text>
                    <Text style={[styles.menuSubText, { color: colors.subtext }]}>Your hives, activity & saved posts</Text>
                  </View>
                  <ChevronRight size={16} color={colors.subtext} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.menuRow, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    onClose();
                    if (onOpenEditProfile) onOpenEditProfile();
                  }}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: colors.surface }]}>
                    <Edit3 size={18} color={colors.accent} />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuMainText, { color: colors.text }]}>Edit Profile Details</Text>
                    <Text style={[styles.menuSubText, { color: colors.subtext }]}>Avatar, full name, username & bio</Text>
                  </View>
                  <ChevronRight size={16} color={colors.subtext} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.menuRow, { borderBottomColor: colors.border }]}
                  onPress={() => handleNavigate('/(app)/(tabs)/profile')}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: colors.surface }]}>
                    <ShieldCheck size={18} color={colors.accent} />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuMainText, { color: colors.text }]}>Account & Role Permissions</Text>
                    <Text style={[styles.menuSubText, { color: colors.subtext }]}>Blockchain certificate & security</Text>
                  </View>
                  <ChevronRight size={16} color={colors.subtext} />
                </TouchableOpacity>

                {/* Section 2: Honey & Ecosystem Hub */}
                <Text style={[styles.sectionTitle, { color: colors.subtext }]}>HONEYCHAIN HUB</Text>

                <TouchableOpacity 
                  style={[styles.menuRow, { borderBottomColor: colors.border }]}
                  onPress={() => handleNavigate('/(app)/(tabs)/explore')}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: colors.surface }]}>
                    <Box size={18} color={colors.accent} />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuMainText, { color: colors.text }]}>My Honey Batches & Hives</Text>
                    <Text style={[styles.menuSubText, { color: colors.subtext }]}>Track IoT telemetry & quality reports</Text>
                  </View>
                  <ChevronRight size={16} color={colors.subtext} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.menuRow, { borderBottomColor: colors.border }]}
                  onPress={() => handleNavigate('/(app)/(tabs)/notifications')}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: colors.surface }]}>
                    <Bell size={18} color={colors.accent} />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuMainText, { color: colors.text }]}>Notifications & Activity</Text>
                    <Text style={[styles.menuSubText, { color: colors.subtext }]}>Alerts, support tips & QR scans</Text>
                  </View>
                  <ChevronRight size={16} color={colors.subtext} />
                </TouchableOpacity>

                {/* Section 3: Logout */}
                <View style={styles.logoutMargin}>
                  <TouchableOpacity 
                    style={[styles.logoutRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => {
                      onClose();
                      if (onOpenLogout) onOpenLogout();
                    }}
                  >
                    <LogOut size={18} color={colors.text} />
                    <Text style={[styles.logoutText, { color: colors.text }]}>Sign Out of HoneyChain</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64,
    paddingRight: 16,
    paddingLeft: 16,
  },
  popoverCard: {
    width: '100%',
    maxWidth: 380,
    maxHeight: Dimensions.get('window').height * 0.85,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  iconCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 24,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  avatarWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  roleBadgeContainer: {
    marginTop: 4,
  },
  identityDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 1,
  },
  walletSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  walletText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  sectionBox: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  themeToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleSwitchCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  roleSwitchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  switchToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleOptionsList: {
    marginTop: 10,
    gap: 8,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  roleTextGroup: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  roleDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  quickStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatNum: {
    fontSize: 15,
    fontWeight: '800',
  },
  quickStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 6,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuMainText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuSubText: {
    fontSize: 11,
    marginTop: 1,
  },
  logoutMargin: {
    marginTop: 16,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
