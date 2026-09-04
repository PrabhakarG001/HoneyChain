import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TestTube, ArrowLeft, CheckCircle, AlertTriangle, ShieldAlert, Award } from 'lucide-react-native';
import { qualityService } from '../../../services/quality.service';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { theme } from '../../../theme';

export default function LabTestRegistrationScreen() {
  const router = useRouter();
  const { batchId: paramBatchId } = useLocalSearchParams();

  const [batchId, setBatchId] = useState(paramBatchId || 'HC-BATCH-901');
  const [pollenCount, setPollenCount] = useState('45000');
  const [c4Sugar, setC4Sugar] = useState('1.2');
  const [hmfLevel, setHmfLevel] = useState('14.5');
  const [moisture, setMoisture] = useState('17.2');
  const [notes, setNotes] = useState('Sample passed NMR and isotope ratio mass spectrometry (IRMS) inspection.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Purity Calculation
  const purityResult = qualityService.calculatePurityScore({
    pollenCount: parseFloat(pollenCount) || 0,
    c4Sugar: parseFloat(c4Sugar) || 0,
    hmf: parseFloat(hmfLevel) || 0,
    moisture: parseFloat(moisture) || 0,
  });

  const handleSubmitTest = async () => {
    if (!batchId.trim()) {
      Alert.alert('Validation Error', 'Please specify a Batch ID.');
      return;
    }

    try {
      setIsSubmitting(true);

      const testPayload = {
        batchId,
        pollenCount: parseFloat(pollenCount) || 0,
        c4Sugar: parseFloat(c4Sugar) || 0,
        hmf: parseFloat(hmfLevel) || 0,
        moisture: parseFloat(moisture) || 0,
        purityScore: purityResult.score,
        grade: purityResult.grade,
        status: purityResult.status,
        passed: purityResult.status === 'COMPLIANT',
        notes,
        labTechnician: 'Dr. Evelyn Vance (Senior Chemist)',
        certifiedAt: new Date().toISOString(),
      };

      await firestoreService.createLabTest(testPayload);
      await auditService.logAction('LAB_TEST_REGISTERED', {
        batchId,
        score: purityResult.score,
        grade: purityResult.grade,
      });

      Alert.alert(
        'Quality Test Certified',
        `Batch ${batchId} analyzed successfully!\nPurity Score: ${purityResult.score}/100 (${purityResult.grade})`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error('Failed to submit lab test:', err);
      Alert.alert('Error', 'Failed to register lab test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Lab Analysis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Score Banner */}
        <View
          style={[
            styles.scoreBanner,
            purityResult.grade === 'GRADE_A' && styles.bannerGradeA,
            purityResult.grade === 'GRADE_B' && styles.bannerGradeB,
            purityResult.grade === 'NON_COMPLIANT' && styles.bannerFailed,
          ]}
        >
          <View style={styles.bannerRow}>
            <Award size={40} color={purityResult.status === 'COMPLIANT' ? '#047857' : '#B91C1C'} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.scoreText}>Honey Purity Score: {purityResult.score} / 100</Text>
              <Text style={styles.gradeText}>
                Grade: {purityResult.grade.replace('_', ' ')} ({purityResult.status})
              </Text>
            </View>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sample Information</Text>

          <Text style={styles.inputLabel}>Batch Identification Code</Text>
          <TextInput
            style={styles.input}
            value={batchId}
            onChangeText={setBatchId}
            placeholder="e.g. HC-BATCH-901"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.sectionTitle}>Physicochemical Parameters</Text>

          <Text style={styles.inputLabel}>Pollen Grain Count (grains/gram)</Text>
          <TextInput
            style={styles.input}
            value={pollenCount}
            onChangeText={setPollenCount}
            keyboardType="numeric"
            placeholder="e.g. 45000"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.hint}>Standard: &gt;20,000 grains/g for mono-floral verification.</Text>

          <Text style={styles.inputLabel}>C4 Sugar Test (% Adulteration)</Text>
          <TextInput
            style={styles.input}
            value={c4Sugar}
            onChangeText={setC4Sugar}
            keyboardType="decimal-pad"
            placeholder="e.g. 1.2"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.hint}>Max limit: 7% for pure honey compliance.</Text>

          <Text style={styles.inputLabel}>HMF Content (mg/kg)</Text>
          <TextInput
            style={styles.input}
            value={hmfLevel}
            onChangeText={setHmfLevel}
            keyboardType="decimal-pad"
            placeholder="e.g. 14.5"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.hint}>Fresh honey standard: &lt;40 mg/kg.</Text>

          <Text style={styles.inputLabel}>Moisture Level (%)</Text>
          <TextInput
            style={styles.input}
            value={moisture}
            onChangeText={setMoisture}
            keyboardType="decimal-pad"
            placeholder="e.g. 17.2"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.hint}>Optimal shelf stability: 15% - 19.5%.</Text>

          <Text style={styles.inputLabel}>Lab Analytical Remarks</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Add chemical analysis notes..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmitTest}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <TestTube size={20} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Certify Lab Test & Push to Passport</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  scoreBanner: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  bannerGradeA: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  bannerGradeB: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  bannerFailed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  hint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 4,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
