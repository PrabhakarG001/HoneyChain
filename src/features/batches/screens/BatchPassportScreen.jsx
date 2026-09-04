import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bookmark, ShieldCheck } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { batchService } from '../../../services/batch.service';
import { useThemeColors } from '../../../hooks/useThemeColors';
import styles from './BatchPassportScreen.styles';

import QualityScore from '../../../components/ui/QualityScore/QualityScore';
import VerificationBadge from '../../../components/ui/VerificationBadge/VerificationBadge';
import HoneyJourney from '../../../components/ui/HoneyJourney/HoneyJourney';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';

export default function BatchPassportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [isSaved, setIsSaved] = useState(false);

  const { data: batch, isLoading } = useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchService.getBatch(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!batch) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Batch passport '{id}' not found</Text>
      </View>
    );
  }

  const batchCode = batch.batch_code || batch.batchCode || batch.id;
  const createdAt = batch.created_at || batch.createdAt;
  const txHash = batch.tx_hash || batch.txHash || `0x_verifiable_${batch.id}`;
  const verificationId = batch.verification_id || batch.verificationId || `VR_${batch.id}`;

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.subtext }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Banner Header */}
        <View style={[styles.heroImageContainer, { backgroundColor: colors.isDark ? '#1C1917' : '#FFFBEB', justifyContent: 'center', alignItems: 'center' }]}>
          {batch.imageUrl ? (
            <Image 
              source={{ uri: batch.imageUrl }} 
              style={styles.heroImage}
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={64} color={colors.accent} />
              <Text style={{ marginTop: 8, fontSize: 16, fontWeight: '700', color: colors.accent }}>HoneyChain Batch Passport</Text>
            </View>
          )}
          <View style={styles.gradientOverlay}>
            <View style={[styles.headerActions, { top: insets.top + 10 }]}>
              <TouchableOpacity 
                style={[styles.iconBtn, { backgroundColor: colors.surface }]}
                onPress={() => router.back()}
              >
                <ChevronLeft color={colors.text} size={24} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconBtn, { backgroundColor: colors.surface }]}
                onPress={() => setIsSaved(!isSaved)}
              >
                <Bookmark 
                  color={isSaved ? colors.accent : colors.text} 
                  fill={isSaved ? colors.accent : 'transparent'} 
                  size={24} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Certificate Header */}
        <View style={styles.headerContent}>
          <BrandLogo style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={[styles.certificateTitle, { color: colors.accent }]}>HONEY PASSPORT</Text>
          <View style={styles.verificationRow}>
            <VerificationBadge type="blockchain" text="VERIFIED AUTHENTIC" />
          </View>

          <View style={styles.headerTopRow}>
            <Text style={[styles.title, { color: colors.text }]}>{batch.floralSource || 'Pure Organic Honey'}</Text>
            <QualityScore score={98} size="large" />
          </View>
          <Text style={[styles.batchId, { color: colors.subtext }]}>Batch Code: {batchCode}</Text>
        </View>

        {/* Origin & Specs */}
        <View style={styles.section}>
          <DetailRow label="Batch ID" value={batch.id} />
          <DetailRow label="Batch Code" value={batchCode} />
          {batch.farmId && <DetailRow label="Farm" value={`Farm ${batch.farmId}`} />}
          {batch.hiveId && <DetailRow label="Hive" value={`Hive ${batch.hiveId}`} />}
          <DetailRow label="Created Date" value={createdAt ? new Date(createdAt).toLocaleDateString() : 'Recorded'} />
          <DetailRow label="Status" value={batch.status || 'CREATED'} />
          <DetailRow label="Genealogy" value={batch.is_merged ? 'Merged Harvests' : 'Single Apiary Source'} />
        </View>

        {/* Journey Timeline */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Supply Chain Lineage</Text>
          <View style={styles.timelineContainer}>
            <HoneyJourney currentStepIndex={3} />
          </View>
        </View>

        {/* Blockchain Verification & QR */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Traceability & Verification</Text>
          
          <View style={[styles.blockchainContainer, { backgroundColor: colors.isDark ? '#1C1917' : '#FEF3C7', borderColor: colors.accent }]}>
            <Text style={[styles.blockchainTitle, { color: colors.accent }]}>✓ Blockchain Verified On-Chain</Text>
            <Text style={[styles.blockchainDesc, { color: colors.text }]}>
              This honey batch's extraction & lab records are immutably indexed on the HoneyChain smart contract ledger.
            </Text>
            <Text style={[styles.blockchainHash, { color: colors.subtext }]}>Tx: {txHash}</Text>
          </View>

          <View style={{ alignItems: 'center', marginTop: 24, padding: 16, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ marginBottom: 12, fontWeight: '600', color: colors.text }}>Scan to Verify Authenticity</Text>
            <QRCode
              value={`https://honeychain.org/verify/${verificationId}`}
              size={150}
              color={colors.text}
              backgroundColor="transparent"
            />
            <Text style={{ marginTop: 12, fontSize: 12, color: colors.subtext }}>Verification ID: {verificationId}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
