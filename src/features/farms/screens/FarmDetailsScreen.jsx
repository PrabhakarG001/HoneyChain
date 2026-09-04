import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Home } from 'lucide-react-native';
import { farmService } from '../../../services/farm.service';
import { hiveService } from '../../../services/hive.service';
import { useThemeColors } from '../../../hooks/useThemeColors';
import styles from './FarmDetailsScreen.styles';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';

export default function FarmDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const { data: farm, isLoading: farmLoading } = useQuery({
    queryKey: ['farm', id],
    queryFn: () => farmService.getFarm(id),
    enabled: !!id,
  });

  const { data: hives, isLoading: hivesLoading } = useQuery({
    queryKey: ['hives', id],
    queryFn: () => hiveService.getHivesByFarm(id),
    enabled: !!id,
  });

  if (farmLoading || hivesLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!farm) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Farm '{id}' not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={[styles.heroImageContainer, { backgroundColor: colors.isDark ? '#1C1917' : '#FFFBEB', justifyContent: 'center', alignItems: 'center' }]}>
          {farm.imageUrl ? (
            <Image 
              source={{ uri: farm.imageUrl }} 
              style={styles.heroImage}
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Home size={56} color={colors.accent} />
              <Text style={{ marginTop: 8, fontSize: 18, fontWeight: '700', color: colors.accent }}>{farm.name}</Text>
            </View>
          )}
        </View>

        {/* Floating Back Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: insets.top + 10,
            left: 16,
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 8,
            zIndex: 10,
            borderWidth: 1,
            borderColor: colors.border
          }}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.farmName, { color: colors.text }]}>{farm.name}</Text>
        <Text style={[styles.location, { color: colors.subtext }]}>{farm.location}</Text>

        <View style={[styles.metricsCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>{farm.area || '2.5'}</Text>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Acres</Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>{farm.floral_source || farm.floralSource || 'Organic'}</Text>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Flora</Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>{farm.bee_species || farm.beeSpecies || 'Apis mellifera'}</Text>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Species</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hives ({(hives || []).length})</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push({ pathname: '/(app)/hives/add', params: { farmId: farm.id } })}
          >
            <Text style={[styles.addButtonText, { color: '#000000' }]}>+ ADD HIVE</Text>
          </TouchableOpacity>
        </View>

        <MasonryGrid 
          data={hives || []}
          renderItem={({ item, index }) => (
            <HoneyCard
              type="hive"
              title={item.name || `Hive ${item.id}`}
              subtitle={item.location || 'Apiary'}
              height={index % 2 === 0 ? 180 : 220}
              onPress={() => router.push(`/(app)/hives/${item.id}`)}
              badgeText={item.status || 'Active'}
            />
          )}
        />
        </View>
      </ScrollView>
    </View>
  );
}
