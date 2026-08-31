import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Thermometer, Droplets, Activity, Cpu, ChevronLeft, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hiveService } from '../../../services/hive.service';
import { theme } from '../../../theme';
import styles from './HiveDetailsScreen.styles';

import HumanizedStat from '../../../components/ui/HumanizedStat/HumanizedStat';

export default function HiveDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: hive, isLoading } = useQuery({
    queryKey: ['hive', id],
    queryFn: () => hiveService.getHive(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primaryDark} size="large" />
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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/hive1/800/600' }} 
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <TouchableOpacity 
              style={[styles.backBtn, { top: insets.top + 10 }]}
              onPress={() => router.back()}
            >
              <ChevronLeft color={theme.colors.charcoal} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.hiveId}>{hive.id}</Text>
            <View style={[styles.statusBadge, isGood ? styles.statusBadgeGood : styles.statusBadgeWarning]}>
              <View style={[styles.statusDot, isGood ? styles.statusDotGood : styles.statusDotWarning]} />
              <Text style={styles.statusText}>
                {isGood ? 'Healthy' : 'Needs Attention'}
              </Text>
            </View>
          </View>
          <Text style={styles.beeSpecies}>{hive.beeSpecies} • Updated 3 min ago</Text>
        </View>

        {/* Edge to Edge Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          
          {hive.iotDeviceId ? (
            <View style={styles.dataContainer}>
              <HumanizedStat 
                icon={Thermometer}
                value={`${hive.temperature}°C`}
                description="Temperature is within the healthy range."
                color={theme.colors.status.warning}
              />
              <HumanizedStat 
                icon={Droplets}
                value={`${hive.humidity}%`}
                description="Humidity is stable today."
                color={theme.colors.status.info}
              />
              <HumanizedStat 
                icon={Activity}
                value={`${hive.currentWeight} kg`}
                description="Weight has increased steadily over the last 7 days."
                color={theme.colors.status.success}
              />
              
              <View style={styles.deviceFooter}>
                <Cpu size={16} color={theme.colors.text.muted} />
                <Text style={styles.deviceText}>Sensor {hive.iotDeviceId} connected</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No sensors are connected to this hive yet.</Text>
              <TouchableOpacity style={styles.assignButton}>
                <Text style={styles.assignButtonText}>Connect Sensor</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityRow}>
            <View style={styles.activityIcon}>
              <Calendar size={18} color={theme.colors.text.secondary} />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Routine Inspection</Text>
              <Text style={styles.activityTime}>Yesterday at 10:00 AM</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
