import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { farmService } from '../../../services/farm.service';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './FarmDetailsScreen.styles';
import MasonryGrid from '../../../components/ui/MasonryGrid/MasonryGrid';
import HoneyCard from '../../../components/ui/HoneyCard/HoneyCard';

export default function FarmDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primaryDark} size="large" />
      </View>
    );
  }

  if (!farm) {
    return (
      <View style={styles.errorContainer}>
        <Text>Farm not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/farmview/600/400' }} 
            style={styles.heroImage}
          />
        </View>

        {/* Floating Back Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: insets.top + 10,
            left: theme.spacing.md,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: theme.radius.full,
            padding: 8,
            zIndex: 10
          }}
          onPress={() => router.back()}
        >
          <ChevronLeft color={theme.colors.white} size={24} />
        </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.farmName}>{farm.name}</Text>
        <Text style={styles.location}>{farm.location}</Text>

        <View style={styles.metricsCard}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{farm.area}</Text>
            <Text style={styles.metricLabel}>Acres</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{farm.floralSource}</Text>
            <Text style={styles.metricLabel}>Flora</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{farm.beeSpecies}</Text>
            <Text style={styles.metricLabel}>Species</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hives ({hives?.length || 0})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/(app)/hives/add', params: { farmId: farm.id } })}
          >
            <Text style={styles.addButtonText}>+ ADD HIVE</Text>
          </TouchableOpacity>
        </View>

        <MasonryGrid 
          data={hives || []}
          renderItem={({ item, index }) => (
            <HoneyCard
              type="hive"
              title={`Hive ${item.id.substring(0,6)}`}
              subtitle={item.healthStatus}
              height={index % 2 === 0 ? 180 : 220}
              onPress={() => router.push(`/(app)/hives/${item.id}`)}
              badgeText={`${item.temperature}°C | ${item.humidity}%`}
            />
          )}
        />
        </View>
      </ScrollView>
    </View>
  );
}
