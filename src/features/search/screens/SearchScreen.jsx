import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { Search, X, Clock, Flame, Globe } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';
import { hiveService } from '../../../services/hive.service';
import { productService } from '../../../services/product.service';
import { batchService } from '../../../services/batch.service';
import { farmService } from '../../../services/farm.service';

const RECENT_SEARCHES = ['Acacia Honey', 'Sonoma Apiary', 'Hive health checks'];
const TRENDING_TOPICS = ['Raw Honey Benefits', 'Winter Beekeeping', 'Blockchain Verification', 'Organic Certification'];
const CATEGORIES = ['Honey Batches', 'Farms', 'Beekeepers', 'Quality Reports'];

export default function SearchScreen() {
  const router = useRouter();
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
    if (query.trim().length > 1) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const q = query.toLowerCase().trim();
      const [hives, products, batches, farms] = await Promise.all([
        hiveService.getAllHives().catch(() => []),
        productService.getProducts().catch(() => []),
        batchService.getBatches().catch(() => []),
        farmService.getFarms().catch(() => [])
      ]);
      
      const hiveResults = (hives || []).filter(h => 
        (h.name && h.name.toLowerCase().includes(q)) ||
        (h.location && h.location.toLowerCase().includes(q)) ||
        (h.hive_code && h.hive_code.toLowerCase().includes(q))
      ).map((h, index) => ({
        id: h.id || h._id,
        type: 'hive',
        title: h.name || `Hive ${h.id}`,
        subtitle: h.location || 'Apiary Location',
        height: index % 2 === 0 ? 220 : 190,
        isVerified: true,
        badgeText: h.status || 'Active'
      }));

      const productResults = (products || []).filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.product_code && p.product_code.toLowerCase().includes(q))
      ).map((p, index) => ({
        id: p.id,
        type: 'product',
        title: p.name || 'Pure Organic Honey',
        subtitle: `Code: ${p.product_code || p.id}`,
        height: index % 2 === 0 ? 240 : 200,
        isVerified: true,
        badgeText: 'Verified'
      }));

      const batchResults = (batches || []).filter(b =>
        (b.batch_code && b.batch_code.toLowerCase().includes(q)) ||
        (b.id && b.id.toLowerCase().includes(q)) ||
        (b.status && b.status.toLowerCase().includes(q))
      ).map((b, index) => ({
        id: b.id,
        type: 'honey',
        title: b.batch_code || b.id,
        subtitle: `Status: ${b.status || 'Created'}`,
        height: index % 2 === 0 ? 210 : 185,
        isVerified: true,
        badgeText: b.is_merged ? 'Merged' : 'Single Source'
      }));

      const farmResults = (farms || []).filter(f =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.location && f.location.toLowerCase().includes(q))
      ).map((f, index) => ({
        id: f.id,
        type: 'farm',
        title: f.name || 'Apiary Farm',
        subtitle: f.location || 'Organic Apiary',
        height: index % 2 === 0 ? 230 : 190,
        isVerified: true,
      }));

      const combined = [...hiveResults, ...productResults, ...batchResults, ...farmResults];
      setResults(combined);
    } catch (err) {
      console.error('Search error', err);
      setError('Search failed. Please try again.');
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
              placeholder={t('searchPlaceholder', 'Search hives, batches, products...')}
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
          
          {query.trim().length === 0 ? (
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
                      badgeText={item.badgeText}
                      onPress={() => handleCardPress(item)}
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
