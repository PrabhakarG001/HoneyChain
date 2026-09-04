import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Edit3, LogOut, Share2 } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './ProfileScreen.styles';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';
import UserAvatar from '../../../components/ui/UserAvatar/UserAvatar';
import TopHeader from '../../../components/navigation/TopHeader';
import EditProfileModal from '../../../components/profile/EditProfileModal';
import LogoutConfirmModal from '../../../components/profile/LogoutConfirmModal';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';

const TABS = ['My Hives', 'Saved', 'Quality Reports', 'Activity'];

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();

  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const [profileData, setProfileData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({ hives: 0, verifications: 12 });

  useEffect(() => {
    fetchProfileContent();
  }, [user]);

  const fetchProfileContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const hives = await hiveService.getAllHives();
      
      const mappedData = (hives || []).map(hive => ({
        id: hive.id || hive._id,
        type: 'hive',
        title: hive.name || `Hive ${hive.id}`,
        subtitle: hive.location || 'Apiary Location',
        height: 220,
        isVerified: true,
      }));
      
      setProfileData(mappedData);
      setUserStats(prev => ({ ...prev, hives: mappedData.length }));
    } catch (err) {
      console.error('Failed to fetch profile data', err);
      setError('Failed to load profile content.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader />

      <ScrollView 
        style={styles.flex1} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {/* User Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={() => setIsEditProfileVisible(true)}
            activeOpacity={0.85}
          >
            <UserAvatar user={user} size={96} />
            <View style={styles.editAvatarBadge}>
              <Edit3 size={16} color={theme.colors.charcoal} />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name || user?.username || 'HoneyChain User'}</Text>
          <Text style={styles.username}>@{user?.username || 'username'}</Text>

          <View style={styles.badgeRow}>
            <VerificationBadge 
              type="blockchain" 
              text={`Verified ${user?.role || 'Member'}`} 
              size="small" 
            />
          </View>

          <Text style={styles.bio}>
            {user?.bio || 'HoneyChain Beekeeping & Blockchain Honey Supply Chain Member.'}
          </Text>

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={styles.editProfileBtn} 
              onPress={() => setIsEditProfileVisible(true)}
            >
              <Edit3 size={16} color={theme.colors.charcoal} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={() => setIsLogoutVisible(true)}
            >
              <LogOut size={16} color="#E53E3E" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.hives}</Text>
              <Text style={styles.statLabel}>Hives</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.verifications}</Text>
              <Text style={styles.statLabel}>Verifications</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Purity Score</Text>
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
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={{ textAlign: 'center', color: theme.colors.status.error, marginTop: 20 }}>
              {error}
            </Text>
          ) : profileData.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.text.secondary, marginTop: 20 }}>
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
