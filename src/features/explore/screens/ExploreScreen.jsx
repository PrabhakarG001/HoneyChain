import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../../../theme';
import styles from './ExploreScreen.styles';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';

const TRENDING_HONEY = [
  { id: '1', title: 'Wild Forest Honey', subtitle: '98 Score', type: 'honey', isVerified: true },
  { id: '2', title: 'Acacia Pure', subtitle: '92 Score', type: 'product', isVerified: true },
  { id: '3', title: 'Mountain Nectar', subtitle: '95 Score', type: 'honey', isVerified: false },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover the best honey and farms</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Honey</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {TRENDING_HONEY.map(item => (
              <View key={item.id} style={styles.carouselItem}>
                <HoneyCard 
                  type={item.type}
                  title={item.title}
                  subtitle={item.subtitle}
                  height={180}
                  isVerified={item.isVerified}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Farms</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.carouselItemLarge}>
                <HoneyCard 
                  type="farm"
                  title={`Farm ${i}`}
                  subtitle="Verified Origin"
                  height={140}
                  isVerified
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
