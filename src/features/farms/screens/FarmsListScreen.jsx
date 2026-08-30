import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Plus, MapPin } from 'lucide-react-native';
import { farmService } from '../../../services/farm.service';
import { useAuthStore } from '../../../store/auth.store';
import { theme } from '../../../theme';
import styles from './FarmsListScreen.styles';

export default function FarmsListScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const { data: farms, isLoading, error } = useQuery({
    queryKey: ['farms', user?.id],
    queryFn: () => farmService.getFarms(user?.id),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load farms.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Farms</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(app)/farms/add')}
        >
          <Plus color={theme.colors.white} size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No farms found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.farmCard}
            onPress={() => router.push(`/(app)/farms/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.farmName}>{item.name}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={16} color={theme.colors.text.muted} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            
            <View style={styles.metricsRow}>
              <View>
                <Text style={styles.metricLabel}>Hives</Text>
                <Text style={styles.metricValue}>{item.numberOfHives}</Text>
              </View>
              <View>
                <Text style={styles.metricLabel}>Flora</Text>
                <Text style={styles.metricValue}>{item.floralSource}</Text>
              </View>
              <View>
                <Text style={styles.metricLabel}>Area</Text>
                <Text style={styles.metricValue}>{item.area} acres</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
