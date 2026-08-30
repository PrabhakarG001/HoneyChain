import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Plus, Thermometer, Droplets, Activity } from 'lucide-react-native';
import { farmService } from '../../../services/farm.service';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './FarmDetailsScreen.styles';

export default function FarmDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

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
        <ActivityIndicator color={theme.colors.primary} size="large" />
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
      <View style={styles.farmHeader}>
        <Text style={styles.farmName}>{farm.name}</Text>
        <Text style={styles.location}>{farm.location}</Text>
        <View style={styles.metricsRow}>
          <View>
            <Text style={styles.metricLabel}>Area</Text>
            <Text style={styles.metricValue}>{farm.area} acres</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Flora</Text>
            <Text style={styles.metricValue}>{farm.floralSource}</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Bee</Text>
            <Text style={styles.metricValue}>{farm.beeSpecies}</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Hives ({hives?.length || 0})</Text>
        <TouchableOpacity 
          style={styles.addHiveButton}
          onPress={() => router.push({ pathname: '/(app)/hives/add', params: { farmId: farm.id } })}
        >
          <Plus color="#ba6000" size={16} />
          <Text style={styles.addHiveText}>Add Hive</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={hives}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.hiveCard}
            onPress={() => router.push(`/(app)/hives/${item.id}`)}
          >
            <View>
              <Text style={styles.hiveId}>{item.id}</Text>
              <View style={styles.hiveStatusContainer}>
                <Text style={styles.hiveStatusLabel}>Status: </Text>
                <Text style={styles.hiveStatusValue}>{item.healthStatus}</Text>
              </View>
            </View>
            <View style={styles.sensorsRow}>
              <View style={styles.sensorItem}>
                <Thermometer size={16} color={theme.colors.status.warning} />
                <Text style={styles.sensorValue}>{item.temperature}°C</Text>
              </View>
              <View style={styles.sensorItem}>
                <Droplets size={16} color={theme.colors.status.info} />
                <Text style={styles.sensorValue}>{item.humidity}%</Text>
              </View>
              <View style={styles.sensorItem}>
                <Activity size={16} color={theme.colors.status.success} />
                <Text style={styles.sensorValue}>{item.currentWeight}kg</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
