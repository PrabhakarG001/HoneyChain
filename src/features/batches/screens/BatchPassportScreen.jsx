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
    { title: 'Harvested from Hive #07', date: new Date(batch.createdAt).toLocaleDateString(), completed: true },
    { title: 'Lab Quality Verified', date: 'Pending', completed: false },
    { title: 'Bottled & Sealed', date: 'Pending', completed: false },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Edge to Edge Hero */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/honey3/800/800' }} 
            style={styles.heroImage}
          />
          <View style={styles.gradientOverlay}>
            <TouchableOpacity 
              style={[styles.backBtn, { top: insets.top + 10 }]}
              onPress={() => router.back()}
            >
              <ChevronLeft color={theme.colors.white} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Certificate Header */}
        <View style={styles.headerContent}>
          <Text style={styles.certificateTitle}>API VERA HONEY PASSPORT</Text>
          <View style={styles.verificationRow}>
            <VerificationBadge type="blockchain" text="VERIFIED AUTHENTIC" size="small" />
          </View>

          <View style={styles.headerTopRow}>
            <Text style={styles.title}>{batch.floralSource || 'Wild Mustard Honey'}</Text>
            <QualityScore score={92} size="large" />
          </View>
          <Text style={styles.batchId}>Batch {batch.id}</Text>
        </View>

        {/* Origin & Specs (No Card, Edge to Edge list) */}
        <View style={styles.section}>
          <DetailRow label="Origin" value="Uttar Pradesh, India" />
          <DetailRow label="Farm" value={`Farm ${batch.farmId}`} />
          <DetailRow label="Hive" value={`Hive ${batch.hiveId}`} />
          <DetailRow label="Harvest Date" value={new Date(batch.createdAt).toLocaleDateString()} />
          <DetailRow label="Quantity" value={`${batch.quantity} kg`} />
        </View>

        {/* Journey Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journey</Text>
          <View style={styles.timelineContainer}>
            <Timeline events={timelineEvents} />
          </View>
        </View>

        {/* Blockchain Verification */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Traceability</Text>
          <View style={styles.blockchainContainer}>
            <Text style={styles.blockchainTitle}>✓ Blockchain Verified</Text>
            <Text style={styles.blockchainDesc}>
              This product's origin and quality records are immutably stored on the HoneyChain network.
            </Text>
            <Text style={styles.blockchainHash}>Tx: 0x8f2c...94a1</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
