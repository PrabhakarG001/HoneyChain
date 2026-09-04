import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Plus, MapPin, Box } from 'lucide-react-native';
import { farmService } from '../../../services/farm.service';
import { useAuthStore } from '../../../store/auth.store';
import { useThemeColors } from '../../../hooks/useThemeColors';
import TopHeader from '../../../components/navigation/TopHeader';
import styles from './FarmsListScreen.styles';

export default function FarmsListScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: farms, isLoading, error, refetch } = useQuery({
    queryKey: ['farms', user?.id],
    queryFn: () => farmService.getFarms(user?.id),
    enabled: !!user?.id,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopHeader />

      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>My Apiary Farms</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/(app)/farms/add')}
          accessibilityRole="button"
          accessibilityLabel="Add new farm"
        >
          <Plus color="#000000" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={farms || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />
        }
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            <Box size={48} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.text, marginTop: 12 }]}>No Apiary Farms Found</Text>
            <Text style={{ fontSize: 13, color: colors.subtext, textAlign: 'center', marginTop: 4, marginBottom: 16 }}>
              Add your first apiary farm to track hives, extractions, and honey provenance.
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
              onPress={() => router.push('/(app)/farms/add')}
            >
              <Text style={{ fontWeight: '700', color: '#000000' }}>+ Add First Farm</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.farmCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => router.push(`/(app)/farms/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.farmName, { color: colors.text }]}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.accent + '22' }]}>
                <Text style={[styles.statusText, { color: colors.accent }]}>{item.status || 'ACTIVE'}</Text>
              </View>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.accent} />
              <Text style={[styles.locationText, { color: colors.subtext }]}>{item.location}</Text>
            </View>
            
            <View style={styles.metricsRow}>
              <View>
                <Text style={[styles.metricLabel, { color: colors.subtext }]}>Hives</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>{item.number_of_hives || item.numberOfHives || 0}</Text>
              </View>
              <View>
                <Text style={[styles.metricLabel, { color: colors.subtext }]}>Flora</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>{item.floral_source || item.floralSource || 'Organic'}</Text>
              </View>
              <View>
                <Text style={[styles.metricLabel, { color: colors.subtext }]}>Area</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>{item.area || '2.5'} acres</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
