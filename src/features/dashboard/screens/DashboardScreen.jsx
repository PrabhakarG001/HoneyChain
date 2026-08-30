import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { USER_ROLES } from '../../../constants/roles';
import { theme } from '../../../theme';
import styles from './DashboardScreen.styles';

import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';

const CATEGORIES = ['All', 'Honey', 'Farms', 'Quality', 'Origins', 'Verified'];

const MOCK_FEED_DATA = [
  { id: '1', type: 'farm', title: 'Varanasi Honey Farm', subtitle: '120 Hives', height: 250, isVerified: true },
  { id: '2', type: 'honey', title: 'Wild Forest Honey', subtitle: 'HC-UP-2026-00123', height: 320, isVerified: true, badgeText: '92 Score' },
  { id: '3', type: 'hive', title: 'Hive HV-UP-00123', subtitle: 'Healthy', height: 200, isVerified: false },
  { id: '4', type: 'product', title: 'Pure Himalayan Honey', subtitle: 'Origin Verified', height: 280, isVerified: true },
  { id: '5', type: 'farm', title: 'Uttarakhand Bees', subtitle: '85 Hives', height: 220, isVerified: true },
  { id: '6', type: 'honey', title: 'Acacia Honey', subtitle: 'HC-UP-2026-00999', height: 300, isVerified: true, badgeText: '98 Score' },
];

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
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
      height={item.height}
      isVerified={item.isVerified}
      badgeText={item.badgeText}
      showFavorite
      onPress={() => handleCardPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning {user?.name?.split(' ')[0]}</Text>
          <Text style={styles.subGreeting}>Discover your honey journey</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut color={theme.colors.text.secondary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search farms, honey batches..."
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map(category => (
            <CategoryChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>

        {user?.role === USER_ROLES.BEEKEEPER && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>My Farms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>205</Text>
              <Text style={styles.statLabel}>Hives</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>14</Text>
              <Text style={styles.statLabel}>Batches</Text>
            </View>
          </View>
        )}

        <View style={styles.feedContainer}>
          <MasonryGrid 
            data={MOCK_FEED_DATA.filter(i => selectedCategory === 'All' || 
                 (selectedCategory === 'Farms' && i.type === 'farm') ||
                 (selectedCategory === 'Honey' && (i.type === 'honey' || i.type === 'product'))
            )}
            renderItem={renderMasonryItem}
          />
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
