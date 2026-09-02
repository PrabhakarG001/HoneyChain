import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Search, X, Clock, Flame } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './SearchScreen.styles';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';
import { hiveService } from '../../../services/hive.service';

const RECENT_SEARCHES = ['Acacia Honey', 'Varanasi Farms', 'Hive health checks'];
const TRENDING_TOPICS = ['Raw Honey Benefits', 'Winter Beekeeping', 'Blockchain Verification', 'Organic Certification'];
const CATEGORIES = ['Honey Batches', 'Farms', 'Beekeepers', 'Quality Reports'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();

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
      ).map(h => ({
        id: h.id || h._id,
        type: 'hive',
        title: h.name || 'Hive',
        subtitle: h.location || 'Unknown',
        height: 200,
        isVerified: true
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
              placeholder="Search HoneyChain"
              placeholderTextColor={theme.colors.text.muted}
              value={query ?? ''}
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
                  <TouchableOpacity key={index} style={styles.listItem} onPress={() => setQuery(item)}>
                    <Clock size={18} color={theme.colors.text.secondary} />
                    <Text style={styles.listText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Trending */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trending topics</Text>
                {TRENDING_TOPICS.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.listItem} onPress={() => setQuery(item)}>
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
                    <TouchableOpacity key={index} style={styles.chip} onPress={() => setQuery(cat)}>
                      <Text style={styles.chipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.resultsContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
              ) : error ? (
                <Text style={{ textAlign: 'center', color: theme.colors.status.error, marginTop: 20 }}>
                  {error}
                </Text>
              ) : results.length === 0 ? (
                <Text style={{ textAlign: 'center', color: theme.colors.text.secondary, marginTop: 20 }}>
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
    </SafeAreaView>
  );
}
