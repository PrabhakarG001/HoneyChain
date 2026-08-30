import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Thermometer, Droplets, Activity, Cpu } from 'lucide-react-native';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './HiveDetailsScreen.styles';

export default function HiveDetailsScreen() {
  const { id } = useLocalSearchParams();

  const { data: hive, isLoading } = useQuery({
    queryKey: ['hive', id],
    queryFn: () => hiveService.getHive(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (!hive) {
    return (
      <View style={styles.errorContainer}>
        <Text>Hive not found</Text>
      </View>
    );
  }

  const isGood = hive.healthStatus === 'GOOD';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hiveHeader}>
        <Text style={styles.hiveId}>{hive.id}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, isGood ? styles.statusBadgeGood : styles.statusBadgeWarning]}>
            <Text style={[styles.statusText, isGood ? styles.statusTextGood : styles.statusTextWarning]}>
              {hive.healthStatus}
            </Text>
          </View>
          <Text style={styles.beeSpecies}>{hive.beeSpecies}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>IoT Sensor Data</Text>
        
        {hive.iotDeviceId ? (
          <View style={styles.iotCard}>
            <View style={styles.iotHeader}>
              <View style={styles.deviceIdRow}>
                <Cpu size={20} color={theme.colors.text.secondary} />
                <Text style={styles.deviceId}>Device ID: {hive.iotDeviceId}</Text>
              </View>
              <View style={styles.statusIndicator} />
            </View>
            
            <View style={styles.sensorsRow}>
              <View style={styles.sensorBlock}>
                <View style={styles.sensorIconContainer}>
                  <Thermometer size={24} color={theme.colors.status.warning} />
                </View>
                <Text style={styles.sensorValue}>{hive.temperature}°C</Text>
                <Text style={styles.sensorLabel}>Temp</Text>
              </View>
              <View style={[styles.sensorBlock, styles.sensorBlockBorder]}>
                <View style={styles.sensorIconContainer}>
                  <Droplets size={24} color={theme.colors.status.info} />
                </View>
                <Text style={styles.sensorValue}>{hive.humidity}%</Text>
                <Text style={styles.sensorLabel}>Humidity</Text>
              </View>
              <View style={styles.sensorBlock}>
                <View style={styles.sensorIconContainer}>
                  <Activity size={24} color={theme.colors.status.success} />
                </View>
                <Text style={styles.sensorValue}>{hive.currentWeight}kg</Text>
                <Text style={styles.sensorLabel}>Weight</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyIotCard}>
            <Text style={styles.emptyIotText}>No IoT device connected</Text>
            <TouchableOpacity style={styles.assignButton}>
              <Text style={styles.assignButtonText}>Assign Device</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
