import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { theme } from '../../../theme';
import styles from './DashboardScreen.styles';

import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import InsightCard from '../../../components/ui/InsightCard/InsightCard';
import HumanizedStat from '../../../components/ui/HumanizedStat/HumanizedStat';
import ActivityTimeline from '../../../components/ui/ActivityTimeline/ActivityTimeline';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';

const CATEGORIES = ['All', 'Honey', 'Farms', 'Quality', 'Origins', 'Verified'];

const MOCK_FEED_DATA = [
  { id: '1', type: 'farm', title: 'Varanasi Honey Farm', subtitle: '120 Hives', height: 250, isVerified: true },
  { id: '2', type: 'honey', title: 'Wild Forest Honey', subtitle: 'HC-UP-2026-00123', height: 320, isVerified: true, badgeText: '92 Score' },
  { id: '3', type: 'hive', title: 'Hive HV-UP-00123', subtitle: 'Healthy', height: 200, isVerified: false },
  { id: '4', type: 'product', title: 'Pure Himalayan Honey', subtitle: 'Origin Verified', height: 280, isVerified: true },
  { id: '5', type: 'farm', title: 'Uttarakhand Bees', subtitle: '85 Hives', height: 220, isVerified: true },
  { id: '6', type: 'honey', title: 'Acacia Honey', subtitle: 'HC-UP-2026-00999', height: 300, isVerified: true, badgeText: '98 Score' },
];

const MOCK_ACTIVITIES = [
  { time: '09:42', title: 'Hive #07 sensor connected', description: 'Device synced successfully' },
  { time: '10:15', title: 'AI detected unusual activity', description: 'Hive #12 showing low foraging' },
  { time: '11:02', title: 'Hive inspection completed', description: 'Recorded by Farmer Ramesh' },
  { time: '14:36', title: '18.5 kg honey harvested', description: 'Batch AV-2026-00192 created' },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleCardPress = (item) => {
    if (item.type === 'farm') {
      router.push(`/farms/${item.id}`);
    } else if (item.type === 'honey' || item.type === 'product') {
      router.push(`/batches/${item.id}`);
    } else if (item.type === 'hive') {
      router.push(`/hives/${item.id}`);
    }
  };

  const openSearch = () => {
    router.push('/(app)/(tabs)/explore');
  };

  const openProfile = () => {
    router.push('/(app)/(tabs)/profile');
  };

  const renderMasonryItem = ({ item }) => (
    <HoneyCard
      type={item.type}
      title={item.title}
      subtitle={item.subtitle}
      height={item.height}
      isVerified={item.isVerified}
      badgeText={item.badgeText}
      showFavorite
      onPress={() => handleCardPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.compactHeader}>
        <BrandLogo style={styles.logoContainer} />
        <TouchableOpacity style={styles.searchBarFake} onPress={openSearch} activeOpacity={0.8}>
          <Search size={18} color={theme.colors.text.secondary} />
          <Text style={styles.searchPlaceholder}>Search batches, farms...</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openProfile}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
            style={styles.headerAvatar} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        
        {/* Humanized Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>{greeting}, {user?.name?.split(' ')[0] || 'Prabhakar'}.</Text>
          <Text style={styles.greetingSubtitle}>Your hives are doing well today.</Text>
          
          <View style={styles.statsRow}>
            <HumanizedStat 
              value="18" 
              description="Healthy Hives" 
              color={theme.colors.status.success}
            />
            <HumanizedStat 
              value="2" 
              description="Attention Needed" 
              color={theme.colors.status.warning}
            />
          </View>
          
          <InsightCard 
            title="AI Insight" 
            insight="Activity in Hive #07 is lower than its normal pattern. A quick inspection is recommended." 
          />
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <ActivityTimeline activities={MOCK_ACTIVITIES} />
        </View>

        {/* Discovery Feed */}
        <View style={styles.feedHeader}>
          <Text style={styles.sectionTitle}>Discovery</Text>
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
          <MasonryGrid 
            data={MOCK_FEED_DATA.filter(i => {
              if (selectedCategory === 'All') return true;
              if (selectedCategory === 'Farms') return i.type === 'farm';
              if (selectedCategory === 'Honey') return i.type === 'honey' || i.type === 'product';
              if (selectedCategory === 'Quality') return i.badgeText;
              if (selectedCategory === 'Origins') return i.subtitle.includes('Origin');
              if (selectedCategory === 'Verified') return i.isVerified;
              return true;
            })}
            renderItem={renderMasonryItem}
          />
        </View>
        
        
        {/* Extra padding for bottom nav */}
        <View style={{ height: 120 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}
