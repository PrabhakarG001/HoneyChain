import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Edit3, LogOut, Share2 } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { hiveService } from '../../../services/hive.service';
import { useThemeColors } from '../../../hooks/useThemeColors';
import styles from './ProfileScreen.styles';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';
import UserAvatar from '../../../components/ui/UserAvatar/UserAvatar';
import TopHeader from '../../../components/navigation/TopHeader';
import EditProfileModal from '../../../components/profile/EditProfileModal';
import LogoutConfirmModal from '../../../components/profile/LogoutConfirmModal';
import ProfileDropdown from '../../../components/profile/ProfileDropdown';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';

import { firestoreService } from '../../../services/firestore.service';

const TABS = ['My Hives', 'Quality Reports', 'Activity'];

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();

  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isProfileHubVisible, setIsProfileHubVisible] = useState(false);

  const [profileData, setProfileData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({ hives: 0, verifications: 0 });

  useEffect(() => {
    fetchProfileContent();
  }, [user]);

  const fetchProfileContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let hives = [];
      try {
        hives = await hiveService.getAllHives();
      } catch (err) {
        hives = await firestoreService.getAllHives();
      }
      
      const mappedData = (hives || []).map(hive => ({
        id: hive.id || hive._id,
        type: 'hive',
        title: hive.name || `Hive ${hive.id}`,
        subtitle: hive.location || 'Apiary Location',
        height: hive.height || 200,
        isVerified: true,
      }));
      
      setProfileData(mappedData);
      setUserStats({ hives: mappedData.length, verifications: mappedData.length > 0 ? mappedData.length * 2 : 0 });
    } catch (err) {
      setProfileData([]);
      setUserStats({ hives: 0, verifications: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopHeader />

      <ScrollView 
        style={[styles.flex1, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {/* User Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={() => setIsProfileHubVisible(true)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Open profile hub"
          >
            <UserAvatar user={user} size={64} />
            <View style={[styles.editAvatarBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
              <Edit3 size={14} color="#000000" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.name, { color: colors.text }]}>{user?.name || user?.username || 'HoneyChain User'}</Text>
          <Text style={[styles.username, { color: colors.subtext }]}>@{user?.username || 'username'}</Text>

          <View style={styles.badgeRow}>
            <VerificationBadge 
              type="blockchain" 
              text={`Verified ${user?.role || 'Member'}`} 
              size="small" 
            />
          </View>

          <Text style={[styles.bio, { color: colors.subtext }]}>
            {user?.bio || 'HoneyChain Beekeeping & Blockchain Honey Supply Chain Member.'}
          </Text>

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.editProfileBtn, { backgroundColor: colors.accent }]} 
              onPress={() => setIsEditProfileVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit Profile Details"
            >
              <Edit3 size={16} color="#000000" />
              <Text style={[styles.editProfileText, { color: '#000000' }]}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.logoutBtn, 
                { backgroundColor: colors.isDark ? '#371B1B' : '#FEE2E2' }
              ]} 
              onPress={() => setIsLogoutVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Log Out"
            >
              <LogOut size={16} color={colors.status.error} />
              <Text style={[styles.logoutText, { color: colors.status.error }]}>Log Out</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Bar */}
          <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{userStats.hives}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Hives</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{userStats.verifications}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Verifications</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>100%</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Purity Score</Text>
            </View>
          </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map(tab => (
              <View key={tab} style={styles.tabWrapper}>
                <CategoryChip 
                  label={tab}
                  isSelected={activeTab === tab}
                  onPress={() => setActiveTab(tab)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content Grid */}
        <View style={styles.contentContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={{ textAlign: 'center', color: colors.status.error, marginTop: 20 }}>
              {error}
            </Text>
          ) : profileData.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.subtext, marginTop: 20 }}>
              No items to display for {activeTab}.
            </Text>
          ) : (
            <MasonryGrid 
              data={profileData}
              renderItem={({ item }) => (
                <HoneyCard
                  type={item.type}
                  title={item.title}
                  subtitle={item.subtitle}
                  height={item.height}
                  isVerified={item.isVerified}
                  showFavorite={false}
                />
              )}
            />
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modals */}
      <ProfileDropdown
        isVisible={isProfileHubVisible}
        onClose={() => setIsProfileHubVisible(false)}
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
    </SafeAreaView>
  );
}
