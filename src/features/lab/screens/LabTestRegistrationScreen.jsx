import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TestTube, ArrowLeft, CheckCircle, AlertTriangle, ShieldAlert, Award } from 'lucide-react-native';
import { qualityService } from '../../../services/quality.service';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { theme } from '../../../theme';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function LabTestRegistrationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
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
        'Lab Certificate Issued',
        `Batch ${batchId} certified with Purity Score ${purityResult.score}/100 (Grade ${purityResult.grade}).`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to register lab test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Purity & Lab Test Registration</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score Preview Banner */}
        <View style={[
          styles.scoreBanner,
          purityResult.grade === 'A' && { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5', borderColor: colors.isDark ? '#047857' : '#A7F3D0' },
          purityResult.grade === 'B' && { backgroundColor: colors.isDark ? '#451A03' : '#FEF3C7', borderColor: colors.isDark ? '#B45309' : '#FDE68A' },
          purityResult.status !== 'COMPLIANT' && { backgroundColor: colors.isDark ? '#450A0A' : '#FEF2F2', borderColor: colors.isDark ? '#991B1B' : '#FCA5A5' },
        ]}>
          <View style={styles.bannerRow}>
            {purityResult.status === 'COMPLIANT' ? (
              <CheckCircle size={32} color={purityResult.grade === 'A' ? '#10B981' : '#D97706'} />
            ) : (
              <ShieldAlert size={32} color="#EF4444" />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.scoreText, { color: colors.text }]}>
                Purity Score: {purityResult.score}/100
              </Text>
              <Text style={[styles.gradeText, { color: colors.subtext }]}>
                Grade: {purityResult.grade} • Status: {purityResult.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Input Form */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Laboratory Metrics Input</Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Batch ID</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={batchId}
            onChangeText={setBatchId}
            placeholder="e.g. HC-BATCH-901"
            placeholderTextColor={colors.subtext}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>Pollen Grains Count (grains/g)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={pollenCount}
            onChangeText={setPollenCount}
            keyboardType="numeric"
            placeholder="e.g. 45000"
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.hint, { color: colors.subtext }]}>Purity Threshold: &gt; 35,000 grains/g for Grade A pure origin.</Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>C4 Sugar Adulteration Index (%)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={c4Sugar}
            onChangeText={setC4Sugar}
            keyboardType="decimal-pad"
            placeholder="e.g. 1.2"
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.hint, { color: colors.subtext }]}>Adulteration limit: Must be &lt; 7.0% (C4 plant sugars).</Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>HMF Concentration (mg/kg)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={hmfLevel}
            onChangeText={setHmfLevel}
            keyboardType="decimal-pad"
            placeholder="e.g. 14.5"
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.hint, { color: colors.subtext }]}>Fresh honey standard: &lt; 40 mg/kg.</Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Moisture Level (%)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={moisture}
            onChangeText={setMoisture}
            keyboardType="decimal-pad"
            placeholder="e.g. 17.2"
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.hint, { color: colors.subtext }]}>Optimal shelf stability: 15% - 19.5%.</Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Lab Analytical Remarks</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text, height: 80, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Add chemical analysis notes..."
            placeholderTextColor={colors.subtext}
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
  scoreBanner: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  hint: {
    fontSize: 12,
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
