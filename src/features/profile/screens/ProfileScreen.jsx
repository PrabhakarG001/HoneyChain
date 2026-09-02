import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { hiveService } from '../../../services/hive.service';
import { authService } from '../../../services/auth.service';
import { theme } from '../../../theme';
import styles from './ProfileScreen.styles';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';

const TABS = ['My Hives', 'My Honey', 'Saved', 'Quality Reports', 'QR Passports', 'Activity'];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();
  
  const [profileData, setProfileData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [userStats, setUserStats] = useState({ hives: 0, followers: 0, following: 0 });

  useEffect(() => {
    fetchProfileContent();
  }, [user]);

  const fetchProfileContent = async () => {
    try {
      setIsLoading(true);
      // Fetch hives
      const hives = await hiveService.getAllHives();
      
      const mappedData = (hives || []).map(hive => ({
        id: hive.id || hive._id,
        type: 'hive',
        title: hive.name || `Hive ${hive.id}`,
        height: 200,
        isVerified: true,
      }));
      
      setProfileData(mappedData);
      setUserStats({ hives: mappedData.length, followers: 1200, following: 45 }); // Keeping social stats static for UI sake if API doesn't have it
    } catch (err) {
      console.error('Failed to fetch profile data', err);
      setError('Failed to load profile content.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.flex1} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        <View style={[styles.headerTop, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <BrandLogo />
          <TouchableOpacity style={styles.settingsBtn} onPress={logout}>
            <Settings color={theme.colors.charcoal} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Image 
            source={{ uri: user?.avatarUrl || 'https://i.pravatar.cc/150?img=12' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <View style={styles.badgeRow}>
            <VerificationBadge type="blockchain" text={`Verified ${user?.role || 'User'}`} size="small" />
          </View>
          <Text style={styles.bio}>
            {user?.bio || 'Passionate about sustainable beekeeping and raw, organic honey.'}
          </Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.statText}><Text style={styles.statNumber}>{userStats.hives}</Text> Hives</Text>
            <Text style={styles.statText}> • </Text>
            <Text style={styles.statText}><Text style={styles.statNumber}>1.2k</Text> Followers</Text>
            <Text style={styles.statText}> • </Text>
            <Text style={styles.statText}><Text style={styles.statNumber}>45</Text> Following</Text>
          </View>
        </View>

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

        <View style={styles.contentContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={{ textAlign: 'center', color: theme.colors.status.error, marginTop: 20 }}>
              {error}
            </Text>
          ) : profileData.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.text.secondary, marginTop: 20 }}>
              No items to display.
            </Text>
          ) : (
            <MasonryGrid 
              data={profileData}
              renderItem={({ item }) => (
                <HoneyCard
                  type={item.type}
                  title={item.title}
                  height={item.height}
                  showFavorite={false}
                />
              )}
            />
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
