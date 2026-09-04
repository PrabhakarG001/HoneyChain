import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { Bell, Plus, MessageSquare, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../hooks/useTranslation';
import BrandLogo from '../ui/BrandLogo/BrandLogo';
import UserAvatar from '../ui/UserAvatar/UserAvatar';
import ProfileDropdown from '../profile/ProfileDropdown';
import EditProfileModal from '../profile/EditProfileModal';
import LogoutConfirmModal from '../profile/LogoutConfirmModal';
import CreateMenu from '../ui/CreateMenu/CreateMenu';
import LanguageModal from '../ui/LanguageModal/LanguageModal';

export default function TopHeader() {
  const { user } = useAuthStore();
  const router = useRouter();
  const colors = useThemeColors();
  const { t, currentLanguage } = useTranslation();
  const { width } = useWindowDimensions();

  const isPhone = width < 768;
  const userRole = (user?.role || 'BEEKEEPER').toUpperCase();
  const isCustomer = userRole === 'CUSTOMER';
  
  // Requirement 6: Beekeeper top navbar phone-only hide for Plus & Chat icons.
  // On Tablet/Desktop (width >= 768), preserve Plus (+) & Chat icons for Beekeeper.
  const showBeekeeperExtraActions = !isCustomer && !isPhone;

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isCreateMenuVisible, setIsCreateMenuVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  return (
    <>
      <View style={[styles.headerContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {/* Brand Logo "Honeychain" */}
        <TouchableOpacity 
          onPress={() => router.push('/(app)/(tabs)')} 
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Honeychain home"
        >
          <BrandLogo />
        </TouchableOpacity>

        {/* Right Header Actions: Notification Bell & Profile Avatar */}
        <View style={styles.rightActions}>
          {showBeekeeperExtraActions && (
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.surface }]}
              onPress={() => setIsCreateMenuVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Create hive or harvest"
            >
              <Plus size={20} color={colors.text} strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          {showBeekeeperExtraActions && (
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(app)/(tabs)/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Open chat"
            >
              <MessageSquare size={20} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Language Selector Globe Icon - Immediately beside Notification button */}
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: colors.surface }]}
            onPress={() => setIsLangModalVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Change Language"
          >
            <Globe size={20} color={colors.accent} />
          </TouchableOpacity>

          {/* Notification Bell Icon */}
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(app)/(tabs)/notifications')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
          >
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity 
            onPress={() => setIsDropdownVisible(true)}
            activeOpacity={0.8}
            style={[styles.avatarWrapper, { borderColor: colors.accent }]}
            accessibilityRole="button"
            accessibilityLabel="Open profile hub"
          >
            <UserAvatar user={user} size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <CreateMenu
        isVisible={isCreateMenuVisible}
        onClose={() => setIsCreateMenuVisible(false)}
      />

      <ProfileDropdown
        isVisible={isDropdownVisible}
        onClose={() => setIsDropdownVisible(false)}
        onOpenEditProfile={() => setIsEditProfileVisible(true)}
        onOpenLogout={() => setIsLogoutVisible(true)}
      />

      <EditProfileModal
        isVisible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
      />

      <LogoutConfirmModal
        isVisible={isLogoutVisible}
        onClose={() => setIsLogoutVisible(false)}
      />

      <LanguageModal
        isVisible={isLangModalVisible}
        visible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: 20,
    borderWidth: 2,
  },
});
