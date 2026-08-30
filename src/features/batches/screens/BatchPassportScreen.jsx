import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { batchService } from '../../../services/batch.service';
import { theme } from '../../../theme';
import styles from './BatchPassportScreen.styles';

import QualityScore from '../../../components/ui/QualityScore/QualityScore';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';
import Timeline from '../../../components/ui/Timeline/Timeline';

export default function BatchPassportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: batch, isLoading } = useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchService.getBatch(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primaryDark} size="large" />
      </View>
    );
  }

  if (!batch) {
    return (
      <View style={styles.errorContainer}>
        <Text>Batch not found</Text>
      </View>
    );
  }

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const timelineEvents = [
    { title: 'Harvested', date: new Date(batch.createdAt).toLocaleDateString(), completed: true },
    { title: 'Lab Testing', date: 'Pending', completed: false },
    { title: 'Processing', date: 'Pending', completed: false },
    { title: 'Packaging', date: 'Pending', completed: false },
    { title: 'Distribution', date: 'Pending', completed: false },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/honey2/600/600' }} 
            style={styles.heroImage}
          />
          <View style={styles.gradientOverlay} />
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

      {/* Header Content */}
      <View style={styles.headerContent}>
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>{batch.floralSource || 'Wild Honey'}</Text>
          <QualityScore score={92} size="large" />
        </View>

        <View style={styles.badgeContainer}>
          <VerificationBadge type="blockchain" text="Blockchain Verified" />
          <VerificationBadge type="ai" text="Quality Analyzed" />
        </View>

        <Text style={styles.batchIdLabel}>BATCH ID</Text>
        <Text style={styles.batchId}>{batch.id}</Text>
      </View>

      {/* Origin & Specs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Origin</Text>
        <View style={styles.card}>
          <DetailRow label="Farm ID" value={batch.farmId} />
          <DetailRow label="Hive ID" value={batch.hiveId} />
          <DetailRow label="Location" value="Gorakhpur, UP" />
          <DetailRow label="Honey Type" value={batch.honeyType} />
          <DetailRow label="Quantity" value={`${batch.quantity} kg`} />
        </View>
      </View>

      {/* Journey Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Journey</Text>
        <View style={styles.card}>
          <Timeline events={timelineEvents} />
        </View>
      </View>

        {/* Blockchain Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={[styles.card, styles.blockchainCard]}>
            <Text style={styles.blockchainTitle}>✓ Verified on Blockchain</Text>
            <DetailRow label="Status" value="VALID" />
            <DetailRow label="Recorded" value={new Date(batch.createdAt).toLocaleDateString()} />
            <Text style={styles.blockchainHash}>Tx: 0x8f2c...94a1</Text>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}
