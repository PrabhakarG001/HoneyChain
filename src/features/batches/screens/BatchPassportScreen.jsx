import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bookmark } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { batchService } from '../../../services/batch.service';
import { theme } from '../../../theme';
import styles from './BatchPassportScreen.styles';

import QualityScore from '../../../components/ui/QualityScore/QualityScore';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';
import HoneyJourney from '../../../components/ui/HoneyJourney/HoneyJourney';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';

export default function BatchPassportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSaved, setIsSaved] = useState(false);

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
            <View style={[styles.headerActions, { top: insets.top + 10 }]}>
              <TouchableOpacity 
                style={styles.iconBtn}
                onPress={() => router.back()}
              >
                <ChevronLeft color={theme.colors.white} size={24} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconBtn}
                onPress={() => setIsSaved(!isSaved)}
              >
                <Bookmark 
                  color={isSaved ? theme.colors.primary : theme.colors.white} 
                  fill={isSaved ? theme.colors.primary : 'transparent'} 
                  size={24} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Certificate Header */}
        <View style={styles.headerContent}>
          <BrandLogo style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.certificateTitle}>HONEY PASSPORT</Text>
          <View style={styles.verificationRow}>
            <VerificationBadge type="blockchain" text="VERIFIED AUTHENTIC" />
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
            <HoneyJourney currentStepIndex={3} />
          </View>
        </View>

        {/* Blockchain Verification & QR */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Traceability & Verification</Text>
          
          {batch.tx_hash && batch.verification_id ? (
            <>
              <View style={styles.blockchainContainer}>
                <Text style={styles.blockchainTitle}>✓ Blockchain Verified</Text>
                <Text style={styles.blockchainDesc}>
                  This product's origin and quality records are immutably stored on the HoneyChain network.
                </Text>
                <Text style={styles.blockchainHash}>Tx: {batch.tx_hash}</Text>
              </View>

              <View style={{ alignItems: 'center', marginTop: 24, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <Text style={{ marginBottom: 12, fontWeight: '600', color: theme.colors.text.primary }}>Scan to Verify Authenticity</Text>
                <QRCode
                  value={`honeychain://verify/${batch.verification_id}`}
                  size={150}
                  color={theme.colors.text.primary}
                  backgroundColor="transparent"
                />
                <Text style={{ marginTop: 12, fontSize: 12, color: theme.colors.text.secondary }}>ID: {batch.verification_id}</Text>
              </View>
            </>
          ) : (
            <View style={styles.blockchainContainer}>
              <Text style={[styles.blockchainTitle, { color: theme.colors.status.error }]}>✗ Blockchain connection unavailable</Text>
              <Text style={styles.blockchainDesc}>
                Verification data is currently pending or unavailable for this batch.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
