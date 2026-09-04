import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ShoppingBag, Award, ShieldCheck, ArrowLeft, Globe } from 'lucide-react-native';
import { productService } from '../../../services/product.service';
import { firestoreService } from '../../../services/firestore.service';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';
import { useTranslation } from '../../../hooks/useTranslation';
import { useThemeColors } from '../../../hooks/useThemeColors';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';

export default function MarketplaceScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();
  const { t } = useTranslation();
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [highPurityOnly, setHighPurityOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const CATEGORIES = ['All', 'Acacia', 'Wildflower', 'Manuka', 'Clover', 'Lavender'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      let backendProds = [];
      try {
        backendProds = await productService.getProducts();
      } catch (err) {
        console.warn('Backend products fetch notice:', err.message);
      }

      let fsProds = [];
      try {
        fsProds = await firestoreService.getProducts();
      } catch (e) {}

      // Normalize & Merge products from backend and firestore
      const normalizedBackend = (backendProds || []).map(p => ({
        id: p.id,
        qrId: p.id,
        productName: p.name || 'Raw Organic Honey',
        beekeeperName: 'Verified Apiary Producer',
        netWeight: '500g',
        floralSource: p.name?.toLowerCase().includes('acacia') ? 'Acacia' : 'Wildflower',
        purityScore: 98,
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80'
      }));

      const combined = [...normalizedBackend, ...(fsProds || [])];
      // De-duplicate by id
      const uniqueProds = Array.from(new Map(combined.map(item => [item.id, item])).values());

      setProducts(uniqueProds.length > 0 ? uniqueProds : [
        {
          id: 'PROD_DEMO_01',
          qrId: 'PROD_DEMO_01',
          productName: 'Raw Wildflower Honey (500g)',
          beekeeperName: 'Sunny Valley Apiary',
          netWeight: '500g',
          floralSource: 'Wildflower',
          purityScore: 98,
          price: 22.50,
          image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80'
        },
        {
          id: 'PROD_DEMO_02',
          qrId: 'PROD_DEMO_02',
          productName: 'Monofloral Acacia Honey (1kg)',
          beekeeperName: 'Highland Organic Apiaries',
          netWeight: '1000g',
          floralSource: 'Acacia',
          purityScore: 96,
          price: 34.00,
          image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80'
        }
      ]);
    } catch (e) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((item) => {
    const pName = (item.productName || '').toLowerCase();
    const fSource = (item.floralSource || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = !q || pName.includes(q) || fSource.includes(q);
    const matchesCategory = selectedCategory === 'All' || fSource === selectedCategory.toLowerCase();
    const matchesPurity = !highPurityOnly || (item.purityScore || 0) >= 95;
    return matchesSearch && matchesCategory && matchesPurity;
  });

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    Alert.alert('Cart Updated', `Added ${product.productName} to your cart.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('honeyStore', 'Honey Discovery & Store')}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity 
            style={styles.cartIconBox}
            onPress={() => setIsLangModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Select language"
          >
            <Globe size={22} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cartIconBox}
            onPress={() => Alert.alert('Shopping Cart', `You have ${cartCount} item(s) in your cart.`)}
          >
            <ShoppingBag size={22} color={colors.text} />
            {cartCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {/* Search Input */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by floral source, beekeeper..."
            placeholderTextColor={colors.subtext}
          />
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip, 
                  { backgroundColor: isSelected ? colors.accent : colors.surface, borderColor: colors.border }
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catChipText, { color: isSelected ? '#000000' : colors.text }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* High Purity Filter Bar */}
        <TouchableOpacity
          style={[
            styles.purityFilterBtn, 
            { backgroundColor: highPurityOnly ? (colors.isDark ? '#3F2D17' : '#FEF3C7') : colors.surface, borderColor: colors.border }
          ]}
          onPress={() => setHighPurityOnly(!highPurityOnly)}
        >
          <Award size={18} color={colors.accent} />
          <Text style={[styles.purityFilterText, { color: colors.text }]}>
            Purity Score &ge; 95% Only
          </Text>
          <ShieldCheck size={18} color={colors.status.success} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Products Grid Header */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Verified Honey Jars ({filteredProducts.length})</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((item) => (
              <View key={item.id} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80' }} style={styles.productImg} />
                
                <View style={styles.cardContent}>
                  {/* Score Pill */}
                  <View style={[styles.scorePill, { backgroundColor: colors.isDark ? 'rgba(244, 185, 66, 0.2)' : '#FEF3C7' }]}>
                    <Award size={12} color={colors.accent} />
                    <Text style={[styles.scorePillText, { color: colors.accent }]}>{item.purityScore}/100 Score</Text>
                  </View>

                  <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.productName}</Text>
                  <Text style={[styles.producerText, { color: colors.subtext }]}>by {item.beekeeperName}</Text>
                  <Text style={[styles.weightText, { color: colors.subtext }]}>{item.netWeight} • {item.floralSource}</Text>

                  <View style={styles.priceRow}>
                    <Text style={[styles.priceText, { color: colors.text }]}>${Number(item.price).toFixed(2)}</Text>
                    
                    <TouchableOpacity 
                      style={[styles.provenanceBtn, { backgroundColor: colors.isDark ? '#27272A' : '#EEF2FF' }]}
                      onPress={() => router.push({ pathname: `/verify/${item.id}`, params: { qrId: item.qrId } })}
                    >
                      <Text style={[styles.provenanceBtnText, { color: colors.accent }]}>View Passport</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={[styles.addCartBtn, { backgroundColor: colors.accent }]}
                    onPress={() => handleAddToCart(item)}
                  >
                    <ShoppingBag size={16} color="#000000" />
                    <Text style={styles.addCartBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cartIconBox: {
    position: 'relative',
    padding: 6,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  catScroll: {
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  purityFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  purityFilterText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  productGrid: {
    gap: 16,
  },
  productCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  productImg: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    gap: 4,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
  },
  producerText: {
    fontSize: 13,
    marginTop: 2,
  },
  weightText: {
    fontSize: 12,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
  },
  provenanceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  provenanceBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  addCartBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
