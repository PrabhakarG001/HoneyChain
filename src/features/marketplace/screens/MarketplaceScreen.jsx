import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ShoppingBag, Award, ShieldCheck, Filter, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react-native';
import { firestoreService } from '../../../services/firestore.service';
import { useScrollToHideNav } from '../../../hooks/useScrollToHideNav';

export default function MarketplaceScreen() {
  const router = useRouter();
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [highPurityOnly, setHighPurityOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const CATEGORIES = ['All', 'Acacia', 'Wildflower', 'Manuka', 'Clover', 'Lavender'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetched = await firestoreService.getProducts();
      setProducts(fetched || []);
    } catch (e) {
      setProducts([]);
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.floralSource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.floralSource.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPurity = !highPurityOnly || item.purityScore >= 95;
    return matchesSearch && matchesCategory && matchesPurity;
  });

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    Alert.alert('Cart Updated', `Added ${product.productName} to your cart.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Honey Discovery & Store</Text>
        <TouchableOpacity 
          style={styles.cartIconBox}
          onPress={() => Alert.alert('Shopping Cart', `You have ${cartCount} item(s) in your cart.`)}
        >
          <ShoppingBag size={22} color="#0F172A" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by floral source, beekeeper..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* High Purity Filter Bar */}
        <TouchableOpacity
          style={[styles.purityFilterBtn, highPurityOnly && styles.purityFilterActive]}
          onPress={() => setHighPurityOnly(!highPurityOnly)}
        >
          <Award size={18} color={highPurityOnly ? '#D97706' : '#64748B'} />
          <Text style={[styles.purityFilterText, highPurityOnly && styles.purityFilterTextActive]}>
            Purity Score &ge; 95% Only
          </Text>
          <ShieldCheck size={18} color={highPurityOnly ? '#10B981' : '#64748B'} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Products List */}
        <Text style={styles.sectionHeader}>Verified Honey Jars ({filteredProducts.length})</Text>

        <View style={styles.productGrid}>
          {filteredProducts.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80' }} style={styles.productImg} />
              
              <View style={styles.cardContent}>
                {/* Score Pill */}
                <View style={styles.scorePill}>
                  <Award size={12} color="#B45309" />
                  <Text style={styles.scorePillText}>{item.purityScore}/100 Score</Text>
                </View>

                <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                <Text style={styles.producerText}>by {item.beekeeperName}</Text>
                <Text style={styles.weightText}>{item.netWeight} • {item.floralSource}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                  
                  <TouchableOpacity 
                    style={styles.provenanceBtn}
                    onPress={() => router.push({ pathname: `/verify/${item.id}`, params: { qrId: item.qrId } })}
                  >
                    <Text style={styles.provenanceBtnText}>View Passport</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.addCartBtn}
                  onPress={() => handleAddToCart(item)}
                >
                  <ShoppingBag size={16} color="#FFFFFF" />
                  <Text style={styles.addCartBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  cartIconBox: {
    position: 'relative',
    padding: 6,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0F172A',
  },
  catScroll: {
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  purityFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  purityFilterActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  purityFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  purityFilterTextActive: {
    color: '#92400E',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  productGrid: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    gap: 4,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  producerText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  weightText: {
    fontSize: 12,
    color: '#64748B',
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
    color: '#0F172A',
  },
  provenanceBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  provenanceBtnText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  },
  addCartBtn: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
