import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './DashboardScreen.styles';

import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import InsightCard from '../../../components/ui/InsightCard/InsightCard';
import HumanizedStat from '../../../components/ui/HumanizedStat/HumanizedStat';
import UserAvatar from '../../../components/ui/UserAvatar/UserAvatar';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import TopHeader from '../../../components/navigation/TopHeader';
import ProtocolOverview from '../../../components/ui/ProtocolOverview/ProtocolOverview';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { firestoreService } from '../../../services/firestore.service';

const CATEGORIES = ['All', 'Honey', 'Farms', 'Quality', 'Origins', 'Verified'];

const SAMPLE_HIVES = [
  { id: 'HIVE-101', name: 'Alpha Apiary Hive 01', location: 'Sunny Meadow', status: 'Healthy', temp: '35.2°C' },
  { id: 'HIVE-102', name: 'Beta Apiary Hive 02', location: 'Pine Ridge', status: 'Healthy', temp: '34.8°C' },
  { id: 'HIVE-103', name: 'Gamma Apiary Hive 03', location: 'Orchard Valley', status: 'Active', temp: '35.0°C' },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const colors = useThemeColors();
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [greeting, setGreeting] = useState('Good morning');
  
  const [hives, setHives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isCustomer = (user?.role || '').toUpperCase() === 'CUSTOMER';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isCustomer) {
        setHives([]);
      } else {
        try {
          const hivesData = await hiveService.getAllHives();
          setHives(hivesData && hivesData.length > 0 ? hivesData : SAMPLE_HIVES);
        } catch (err) {
          // If backend API returns 401/403 or network error, fallback to Firestore or sample hives
          const firestoreHives = await firestoreService.getAllHives();
          if (firestoreHives && firestoreHives.length > 0) {
            setHives(firestoreHives);
          } else {
            setHives(SAMPLE_HIVES);
          }
        }
      }
    } catch (err) {
      setHives(SAMPLE_HIVES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (item) => {
    if (item.type === 'farm') {
      router.push(`/farms/${item.id}`);
    } else if (item.type === 'honey' || item.type === 'product') {
      router.push(`/batches/${item.id}`);
    } else if (item.type === 'hive') {
      router.push(`/hives/${item.id}`);
    }
  };

  const renderMasonryItem = ({ item }) => (
    <HoneyCard
      type={item.type}
      title={item.title}
      subtitle={item.subtitle}
      height={item.height || 200}
      isVerified={item.isVerified}
      badgeText={item.badgeText}
      showFavorite
      onPress={() => handleCardPress(item)}
    />
  );

  const feedData = isCustomer 
    ? [
        { id: 'BATCH_A1B2C3D4', type: 'honey', title: 'Raw Organic Acacia Honey', subtitle: 'Sunny Valley Apiary • Sonoma, CA', height: 250, isVerified: true, badgeText: 'Lab Tested', imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80' },
        { id: 'BATCH_E5F6G7H8', type: 'honey', title: 'Mountain Lavender Honey', subtitle: 'Highland Organic • Batch #HC-901', height: 190, isVerified: true, badgeText: 'Blockchain Recorded', imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80' },
        { id: 'BATCH_C9D0E1F2', type: 'honey', title: 'Bio-Active Manuka Honey (UMF 15+)', subtitle: 'Aotearoa Cooperative • NZ', height: 270, isVerified: true, badgeText: 'Verified Origin', imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80' },
        { id: 'BATCH_G3H4I5J6', type: 'honey', title: 'Wildflower Comb Honey Jar', subtitle: 'Oregon Apiary • Batch #HC-882', height: 210, isVerified: true, badgeText: 'Lab Certified', imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80' }
      ]
    : hives.map((hive, idx) => ({
        id: hive.id || hive._id,
        type: 'hive',
        title: hive.name || `Hive ${hive.id}`,
        subtitle: hive.location || 'Sonoma Apiary Region',
        height: idx % 2 === 0 ? 240 : 190,
        isVerified: true,
        badgeText: hive.status || 'Active',
        imageUrl: idx % 2 === 0 
          ? 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80'
          : 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80'
      }));

  const healthyHivesCount = hives.filter(h => h.status !== 'Warning' && h.status !== 'Critical').length;
  const attentionHivesCount = hives.length - healthyHivesCount;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopHeader />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        
        {/* Greeting & Protocol Overview Section */}
        <View style={styles.greetingSection}>
          <ProtocolOverview />
          
          <Text style={styles.greetingTitle}>{greeting}, {user?.name?.split(' ')[0] || user?.username || 'User'}.</Text>
          <Text style={styles.greetingSubtitle}>
            {isCustomer ? 'Welcome to your Honey Transparency Hub.' : 'Here is your apiary summary for today.'}
          </Text>
          
          <View style={styles.statsRow}>
            {isCustomer ? (
              <>
                <HumanizedStat 
                  value="2" 
                  description="Verified Honey Purchases" 
                  color={theme.colors.status.success}
                />
                <HumanizedStat 
                  value="100%" 
                  description="On-Chain Authenticity" 
                  color={theme.colors.primaryDark}
                />
              </>
            ) : (
              <>
                <HumanizedStat 
                  value={isLoading ? '-' : healthyHivesCount.toString()} 
                  description="Healthy Hives" 
                  color={theme.colors.status.success}
                />
                <HumanizedStat 
                  value={isLoading ? '-' : attentionHivesCount.toString()} 
                  description="Attention Needed" 
                  color={theme.colors.status.warning}
                />
              </>
            )}
          </View>
          
          {!isCustomer && attentionHivesCount > 0 && (
            <InsightCard 
              title="AI Insight" 
              insight="Some hives need your attention. Check their telemetry for details." 
            />
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: theme.colors.status.error }}>
            {error}
          </Text>
        ) : (
          <>
            <View style={styles.feedHeader}>
              <Text style={styles.sectionTitle}>{isCustomer ? 'Verified Honey Batches' : 'Discovery'}</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              {CATEGORIES.map(category => (
                <View key={category} style={styles.chipWrapper}>
                  <CategoryChip
                    label={category}
                    isSelected={selectedCategory === category}
                    onPress={() => setSelectedCategory(category)}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.feedContainer}>
              {feedData.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.text.secondary }}>
                  No items available.
                </Text>
              ) : (
                <MasonryGrid 
                  data={feedData.filter(i => {
                    if (selectedCategory === 'All') return true;
                    if (selectedCategory === 'Farms') return i.type === 'farm';
                    if (selectedCategory === 'Honey') return i.type === 'honey' || i.type === 'product';
                    if (selectedCategory === 'Quality') return i.badgeText;
                    if (selectedCategory === 'Origins') return i.subtitle.includes('Origin') || i.subtitle.includes('Apiary');
                    if (selectedCategory === 'Verified') return i.isVerified;
                    return true;
                  })}
                  renderItem={renderMasonryItem}
                />
              )}
            </View>
          </>
        )}
        
        <View style={{ height: 120 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}
