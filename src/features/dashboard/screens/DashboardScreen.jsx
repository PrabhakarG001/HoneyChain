import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ShoppingBag, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Award } from 'lucide-react-native';
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

const CATEGORIES = ['All', 'Hives', 'Apiaries', 'Quality', 'Verified'];

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
          setHives(hivesData || []);
        } catch (err) {
          const firestoreHives = await firestoreService.getAllHives();
          setHives(firestoreHives || []);
        }
      }
    } catch (err) {
      setHives([]);
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

  const feedData = hives.map((hive, idx) => ({
    id: hive.id || hive._id,
    type: 'hive',
    title: hive.name || `Hive ${hive.id}`,
    subtitle: hive.location || 'Apiary Location',
    height: idx % 2 === 0 ? 220 : 180,
    isVerified: true,
    badgeText: hive.status || 'Active',
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
          
          <View style={styles.greetingHeaderRow}>
            <View>
              <Text style={[styles.greetingTitle, { color: colors.text }]}>
                {greeting},{' '}
                <Text style={{ color: colors.isDark ? '#F4B942' : '#D97706', fontWeight: '700' }}>
                  {user?.name?.split(' ')[0] || user?.username || 'User'}
                </Text>
              </Text>
              <Text style={[styles.greetingSubtitle, { color: colors.subtext }]}>
                {isCustomer ? 'Welcome to your Honey Transparency Hub.' : 'Here is your apiary summary for today.'}
              </Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: colors.isDark ? '#1E293B' : '#F1F5F9', borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.statusTagText, { color: colors.isDark ? '#F59E0B' : '#D97706' }]}>
                {isCustomer ? 'Verified Consumer' : 'Certified Apiary'}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {isCustomer ? (
              <>
                <HumanizedStat 
                  icon={ShoppingBag}
                  value="2" 
                  description="Verified Honey Purchases" 
                  color="#10B981"
                  badgeText="Active"
                />
                <HumanizedStat 
                  icon={ShieldCheck}
                  value="100%" 
                  description="On-Chain Authenticity" 
                  color={colors.isDark ? '#F4B942' : '#D97706'}
                  badgeText="Secured"
                />
              </>
            ) : (
              <>
                <HumanizedStat 
                  icon={CheckCircle2}
                  value={isLoading ? '-' : healthyHivesCount.toString()} 
                  description="Healthy Hives" 
                  color="#10B981"
                  badgeText="Normal"
                />
                <HumanizedStat 
                  icon={AlertTriangle}
                  value={isLoading ? '-' : attentionHivesCount.toString()} 
                  description="Attention Needed" 
                  color="#F59E0B"
                  badgeText={attentionHivesCount > 0 ? "Review" : "Clean"}
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
              <View style={styles.sectionHeaderTitleRow}>
                <Award size={22} color={colors.isDark ? '#F4B942' : '#D97706'} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {isCustomer ? 'Verified Honey Batches' : 'Discovery'}
                </Text>
              </View>
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
                    if (selectedCategory === 'Hives') return i.type === 'hive';
                    if (selectedCategory === 'Apiaries' || selectedCategory === 'Farms') return i.type === 'farm' || i.type === 'apiary';
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
