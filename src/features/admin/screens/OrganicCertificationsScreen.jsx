import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Award, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Clock } from 'lucide-react-native';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function OrganicCertificationsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_CERTS = [
    {
      id: 'CERT-2026-01',
      beekeeperName: 'Master Beekeeper Prabhakar',
      apiaryName: 'Green Valley Apiary',
      location: 'Sonoma County, CA',
      status: 'APPROVED',
      issuedDate: '2026-01-10',
      expiryDate: '2027-01-10',
      organicSeal: 'USDA & EU ORGANIC VERIFIED',
    },
    {
      id: 'CERT-2026-02',
      beekeeperName: 'Highland Bee Colony',
      apiaryName: 'Mountain Ridge Apiary',
      location: 'Oregon Meadows, OR',
      status: 'PENDING',
      issuedDate: 'Pending Audit',
      expiryDate: 'Pending Audit',
      organicSeal: 'PENDING AUDIT REVIEW',
    },
    {
      id: 'CERT-2026-03',
      beekeeperName: 'Coastal Wildflower Honey Co.',
      apiaryName: 'Pacific Apiary',
      location: 'Mendocino, CA',
      status: 'APPROVED',
      issuedDate: '2025-11-20',
      expiryDate: '2026-11-20',
      organicSeal: 'NON-GMO & BIO ORGANIC SEAL',
    },
  ];

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const fetched = await firestoreService.getCertifications();
      if (fetched && fetched.length > 0) {
        setCertifications(fetched);
      } else {
        setCertifications(DEFAULT_CERTS);
      }
    } catch (e) {
      setCertifications(DEFAULT_CERTS);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (certId, newStatus) => {
    try {
      await firestoreService.updateCertificationStatus(certId, newStatus);
      await auditService.logAction('ORGANIC_CERT_UPDATED', { certId, newStatus });

      setCertifications((prev) =>
        prev.map((c) => (c.id === certId ? { ...c, status: newStatus } : c))
      );

      Alert.alert('Status Updated', `Certification ${certId} set to ${newStatus}.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update certification status.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Organic Certification Audits</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Beekeeper & Apiary Applications</Text>

        {loading ? (
          <ActivityIndicator color="#059669" size="large" style={{ marginVertical: 40 }} />
        ) : (
          certifications.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Award size={28} color={item.status === 'APPROVED' ? '#059669' : item.status === 'PENDING' ? '#D97706' : '#DC2626'} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.beekeeperName, { color: colors.text }]}>{item.beekeeperName}</Text>
                  <Text style={[styles.apiarySub, { color: colors.subtext }]}>{item.apiaryName} • {item.location}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  item.status === 'APPROVED' && { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' },
                  item.status === 'PENDING' && { backgroundColor: colors.isDark ? '#451A03' : '#FEF3C7' },
                  item.status === 'REJECTED' && { backgroundColor: colors.isDark ? '#450A0A' : '#FEF2F2' },
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    { color: item.status === 'APPROVED' ? (colors.isDark ? '#34D399' : '#047857') : item.status === 'PENDING' ? (colors.isDark ? '#FBBF24' : '#B45309') : (colors.isDark ? '#F87171' : '#B91C1C') }
                  ]}>{item.status}</Text>
                </View>
              </View>

              <View style={[styles.detailsBox, { backgroundColor: colors.background }]}>
                <Text style={[styles.sealText, { color: colors.text }]}>Seal: {item.organicSeal}</Text>
                <Text style={[styles.dateText, { color: colors.subtext }]}>Issued: {item.issuedDate} | Expiry: {item.expiryDate}</Text>
              </View>

              <View style={styles.actionRow}>
                {item.status !== 'APPROVED' && (
                  <TouchableOpacity
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() => handleUpdateStatus(item.id, 'APPROVED')}
                  >
                    <CheckCircle2 size={16} color="#FFFFFF" />
                    <Text style={styles.btnText}>Approve & Issue Seal</Text>
                  </TouchableOpacity>
                )}

                {item.status !== 'REJECTED' && (
                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleUpdateStatus(item.id, 'REJECTED')}
                  >
                    <XCircle size={16} color="#FFFFFF" />
                    <Text style={styles.btnText}>Reject Application</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beekeeperName: {
    fontSize: 16,
    fontWeight: '700',
  },
  apiarySub: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  detailsBox: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
  },
  sealText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  approveBtn: {
    backgroundColor: '#059669',
  },
  rejectBtn: {
    backgroundColor: '#DC2626',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
