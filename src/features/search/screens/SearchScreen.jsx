import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Search, X, Clock, Flame } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './SearchScreen.styles';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';

const RECENT_SEARCHES = ['Acacia Honey', 'Varanasi Farms', 'Hive health checks'];
const TRENDING_TOPICS = ['Raw Honey Benefits', 'Winter Beekeeping', 'Blockchain Verification', 'Organic Certification'];
const CATEGORIES = ['Honey Batches', 'Farms', 'Beekeepers', 'Quality Reports'];

const MOCK_SEARCH_RESULTS = [
  { id: '1', type: 'honey', title: 'Wild Forest Honey', height: 280, isVerified: true, subtitle: 'HC-UP-2026-000123' },
  { id: '2', type: 'farm', title: 'Varanasi Farms', height: 200, isVerified: true, subtitle: '120 Hives' },
  { id: '3', type: 'honey', title: 'Premium Acacia', height: 250, isVerified: true, subtitle: 'HC-UP-2026-000456' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <BrandLogo style={{ marginBottom: 16 }} />
          <View style={styles.searchBar}>
            <Search size={20} color={theme.colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Search ApiVera"
              placeholderTextColor={theme.colors.text.muted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          
          {query.length === 0 ? (
            <>
              {/* Recent Searches */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent searches</Text>
                {RECENT_SEARCHES.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.listItem}>
                    <Clock size={18} color={theme.colors.text.secondary} />
                    <Text style={styles.listText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Trending */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trending topics</Text>
                {TRENDING_TOPICS.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.listItem}>
                    <Flame size={18} color={theme.colors.primary} />
                    <Text style={styles.listText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Categories */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.chipGrid}>
                  {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
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

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
