import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { User, Edit3, ShieldCheck, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/auth.store';
import UserAvatar from '../ui/UserAvatar/UserAvatar';
import VerificationBadge from '../ui/VerificationBadge/VerificationBadge';

export default function ProfileDropdown({ isVisible, onClose, onOpenEditProfile, onOpenLogout }) {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!isVisible) return null;

  const handleNavigateProfile = () => {
    onClose();
    router.push('/(app)/(tabs)/profile');
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dropdownCard}>
              
              {/* User Header Summary */}
              <TouchableOpacity style={styles.userHeader} onPress={handleNavigateProfile} activeOpacity={0.8}>
                <UserAvatar user={user} size={48} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user?.name || user?.username || 'User'}
                  </Text>
                  <Text style={styles.userHandle} numberOfLines={1}>
                    @{user?.username || 'user'}
                  </Text>
                  <View style={{ marginTop: 4 }}>
                    <VerificationBadge type="blockchain" text={user?.role || 'Member'} size="small" />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Menu Items */}
              <TouchableOpacity style={styles.menuItem} onPress={handleNavigateProfile}>
                <User size={18} color={theme.colors.text.primary} />
                <Text style={styles.menuText}>View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  onClose();
                  if (onOpenEditProfile) onOpenEditProfile();
                }}
              >
                <Edit3 size={18} color={theme.colors.text.primary} />
                <Text style={styles.menuText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleNavigateProfile}>
                <ShieldCheck size={18} color={theme.colors.text.primary} />
                <Text style={styles.menuText}>Account & Role Status</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutItem]} 
                onPress={() => {
                  onClose();
                  if (onOpenLogout) onOpenLogout();
                }}
              >
                <LogOut size={18} color="#E53E3E" />
                <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
              </TouchableOpacity>

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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdownCard: {
    width: 260,
    backgroundColor: theme.colors.background.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  userHandle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  logoutItem: {
    marginTop: 2,
  },
  logoutText: {
    color: '#E53E3E',
  },
});
