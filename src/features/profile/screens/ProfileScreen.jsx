import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { theme } from '../../../theme';
import styles from './ProfileScreen.styles';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';

const TABS = ['My Hives', 'My Honey', 'Saved', 'Quality Reports', 'QR Passports', 'Activity'];

const MOCK_PROFILE_DATA = [
  { id: 'p1', type: 'honey', title: 'Summer Harvest 2026', height: 260 },
  { id: 'p2', type: 'hive', title: 'Hive Alpha', height: 200 },
  { id: 'p3', type: 'honey', title: 'Raw Acacia', height: 280 },
  { id: 'p4', type: 'farm', title: 'North Field', height: 220 },
];

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.settingsBtn}>
            <Settings color={theme.colors.charcoal} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{user?.name || 'Prabhakar'}</Text>
          <View style={styles.badgeRow}>
            <VerificationBadge type="blockchain" text="Verified Beekeeper" size="small" />
          </View>
          <Text style={styles.bio}>
            Passionate about sustainable beekeeping and raw, organic honey. Based in Varanasi.
          </Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.statText}><Text style={styles.statNumber}>120</Text> Hives</Text>
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
          <MasonryGrid 
            data={MOCK_PROFILE_DATA}
            renderItem={({ item }) => (
              <HoneyCard
                type={item.type}
                title={item.title}
                height={item.height}
                showFavorite={false}
              />
            )}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
