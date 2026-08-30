import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image } from 'react-native';
import { useAuthStore } from '../../../store/auth.store';
import { USER_ROLES } from '../../../constants/roles';
import { theme } from '../../../theme';
import styles from './ProfileScreen.styles';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';

const TABS = ['Saved', 'Verified', 'History'];

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Saved');
  
  const isBeekeeper = user?.role === USER_ROLES.BEEKEEPER;
  const userTabs = isBeekeeper ? ['Farms', 'Hives', 'Batches'] : TABS;
  const [activeUserTab, setActiveUserTab] = useState(userTabs[0]);

  const MOCK_PROFILE_DATA = [
    { id: 'p1', type: 'product', title: 'Saved Honey 1', height: 200 },
    { id: 'p2', type: 'product', title: 'Saved Honey 2', height: 260 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileText}>
            <Text style={styles.name}>{user?.name || 'Prabhakar'}</Text>
            <Text style={styles.role}>HoneyChain User</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Scanned</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {userTabs.map(tab => (
          <CategoryChip 
            key={tab}
            label={tab}
            isSelected={activeUserTab === tab}
            onPress={() => setActiveUserTab(tab)}
          />
        ))}
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <MasonryGrid 
          data={MOCK_PROFILE_DATA}
          renderItem={({ item }) => (
            <HoneyCard
              type={item.type}
              title={item.title}
              height={item.height}
              showFavorite
            />
          )}
        />
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
