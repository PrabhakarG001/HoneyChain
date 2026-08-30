import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { QrCode, MapPin, FlaskConical, Truck, Package, ShieldCheck } from 'lucide-react-native';
import { batchService } from '../../../services/batch.service';
import { theme } from '../../../theme';
import styles from './BatchPassportScreen.styles';

export default function BatchPassportScreen() {
  const { id } = useLocalSearchParams();

  const { data: batch, isLoading } = useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchService.getBatch(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.qrPlaceholder}>
          <QrCode size={64} color={theme.colors.borderDark} />
          <Text style={styles.qrLabel}>QR Code</Text>
        </View>
        <Text style={styles.batchId}>{batch.id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{batch.status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={theme.colors.charcoal} />
            <Text style={styles.sectionTitle}>Origin Details</Text>
          </View>
          <DetailRow label="Farm ID" value={batch.farmId} />
          <DetailRow label="Hive ID" value={batch.hiveId} />
          <DetailRow label="Harvest Date" value={new Date(batch.harvestDate || batch.createdAt).toLocaleDateString()} />
          <DetailRow label="Location" value="Gorakhpur, UP" />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <FlaskConical size={20} color={theme.colors.charcoal} />
            <Text style={styles.sectionTitle}>Product Specs</Text>
          </View>
          <DetailRow label="Honey Type" value={batch.honeyType} />
          <DetailRow label="Floral Source" value={batch.floralSource} />
          <DetailRow label="Quantity" value={`${batch.quantity} kg`} />
        </View>

        <Text style={styles.timelineSectionTitle}>Traceability Timeline</Text>
        
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineLine}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineVertical} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Harvested</Text>
              <Text style={styles.timelineDate}>{new Date(batch.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLine}>
              <View style={[styles.timelineDot, styles.timelineDotInactive]} />
              <View style={styles.timelineVertical} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, styles.timelineTitleInactive]}>Lab Testing</Text>
              <Text style={styles.timelineDate}>Pending</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLine}>
              <View style={[styles.timelineDot, styles.timelineDotInactive]} />
              <View style={styles.timelineVertical} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, styles.timelineTitleInactive]}>Processing</Text>
              <Text style={styles.timelineDate}>Pending</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLine}>
              <View style={[styles.timelineDot, styles.timelineDotInactive]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, styles.timelineTitleInactive]}>Packaging</Text>
              <Text style={styles.timelineDate}>Pending</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.viewBlockchainButton}>
          <ShieldCheck size={20} color={theme.colors.white} />
          <Text style={styles.viewBlockchainText}>View on Blockchain (Coming Soon)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
