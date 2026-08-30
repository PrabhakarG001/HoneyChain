import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../../theme';
import styles from './SearchScreen.styles';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import CategoryChip from '../../../components/ui/CategoryChip/CategoryChip';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';

const RECENT_SEARCHES = ['Wild Forest Honey', 'HC-UP-2026-000123', 'Varanasi Farms', 'Verified Honey'];
const POPULAR_CATEGORIES = ['🍯 Honey', '🐝 Farms', '🌿 Floral Sources', '🧪 Quality', '⛓ Verified', '📍 Origins'];

const MOCK_SEARCH_RESULTS = [
  { id: '1', type: 'honey', title: 'Wild Forest Honey', height: 280, isVerified: true, subtitle: 'HC-UP-2026-000123' },
  { id: '2', type: 'farm', title: 'Varanasi Farms', height: 200, isVerified: true, subtitle: '120 Hives' },
  { id: '3', type: 'honey', title: 'Premium Acacia', height: 250, isVerified: true, subtitle: 'HC-UP-2026-000456' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search farms, honey, batches..."
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {!isSearching ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.recentContainer}>
                  {RECENT_SEARCHES.map((term, i) => (
                    <View key={i} style={styles.recentItem}>
                      <Text style={styles.recentText}>{term}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Categories</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.chipScroll}
                  contentContainerStyle={styles.chipScrollContent}
                >
                  {POPULAR_CATEGORIES.map((cat, i) => (
                    <View key={i} style={styles.chipWrapper}>
                      <CategoryChip 
                        label={cat}
                        isSelected={false}
                        onPress={() => setSearchQuery(cat)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : (
            <View style={styles.resultsContainer}>
              <MasonryGrid 
                data={MOCK_SEARCH_RESULTS}
                renderItem={({ item }) => (
                  <HoneyCard
                    type={item.type}
                    title={item.title}
                    subtitle={item.subtitle}
                    height={item.height}
                    isVerified={item.isVerified}
                  />
                )}
              />
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
