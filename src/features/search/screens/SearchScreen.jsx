import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { Search, X, Clock, Flame, Globe } from 'lucide-react-native';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';
import { hiveService } from '../../../services/hive.service';
import { useLocalSearchParams } from 'expo-router';

const RECENT_SEARCHES = ['Acacia Honey', 'Sonoma Apiary', 'Hive health checks'];
const TRENDING_TOPICS = ['Raw Honey Benefits', 'Winter Beekeeping', 'Blockchain Verification', 'Organic Certification'];
const CATEGORIES = ['Honey Batches', 'Farms', 'Beekeepers', 'Quality Reports'];

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const colors = useThemeColors();
  const { t, currentLanguage } = useTranslation();
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [query, setQuery] = useState(params?.q || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();

  useEffect(() => {
    if (params?.q) {
      setQuery(params.q);
    }
  }, [params?.q]);

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const hives = await hiveService.getAllHives();
      
      const filtered = (hives || []).filter(h => 
        (h.name && h.name.toLowerCase().includes(query.toLowerCase())) ||
        (h.location && h.location.toLowerCase().includes(query.toLowerCase()))
      ).map((h, index) => ({
        id: h.id || h._id,
        type: 'hive',
        title: h.name || 'Hive',
        subtitle: h.location || 'Sonoma Apiary',
        height: index % 2 === 0 ? 250 : 195,
        isVerified: true,
        imageUrl: index % 2 === 0 
          ? 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80'
          : 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80'
      }));
      
      setResults(filtered);
    } catch (err) {
      console.error('Search error', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <BrandLogo />
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
              onPress={() => setIsLangModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Select language"
            >
              <Globe size={16} color={colors.accent} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{currentLanguage.native}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={18} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t('searchPlaceholder', 'Search HoneyChain')}
              placeholderTextColor={colors.subtext}
              value={query ?? ''}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={18} color={colors.subtext} />
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
                <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Recent searches</Text>
                {RECENT_SEARCHES.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.listItem, { borderBottomColor: colors.border }]} 
                    onPress={() => setQuery(item)}
                  >
                    <Clock size={18} color={colors.subtext} />
                    <Text style={[styles.listText, { color: colors.text }]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Trending */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Trending topics</Text>
                {TRENDING_TOPICS.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.listItem, { borderBottomColor: colors.border }]} 
                    onPress={() => setQuery(item)}
                  >
                    <Flame size={18} color={colors.accent} />
                    <Text style={[styles.listText, { color: colors.text }]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Categories */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Categories</Text>
                <View style={styles.chipGrid}>
                  {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                      onPress={() => setQuery(cat)}
                    >
                      <Text style={[styles.chipText, { color: colors.text }]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.resultsContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
              ) : error ? (
                <Text style={{ textAlign: 'center', color: colors.status.error, marginTop: 20 }}>
                  {error}
                </Text>
              ) : results.length === 0 ? (
                <Text style={{ textAlign: 'center', color: colors.subtext, marginTop: 20 }}>
                  No results found for "{query}".
                </Text>
              ) : (
                <MasonryGrid 
                  data={results}
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
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <LanguageModal 
        visible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  listText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 8,
  },
});
