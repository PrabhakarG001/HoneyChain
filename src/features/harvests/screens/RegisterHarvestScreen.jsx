import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft, Box, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { useAuth } from '../../../context/AuthContext';
import TopHeader from '../../../components/navigation/TopHeader';

export default function RegisterHarvestScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [batchId, setBatchId] = useState(`BATCH_${Math.floor(100000 + Math.random() * 900000)}`);
  const [botanicalOrigin, setBotanicalOrigin] = useState('Acacia Blossom');
  const [weight, setWeight] = useState('250'); // kg
  const [moisture, setMoisture] = useState('17.2'); // %
  const [extractionMethod, setExtractionMethod] = useState('Cold Pressed Centrifuge');
  const [notes, setNotes] = useState('Harvested from Hive 01 (Sunny Valley Apiary). Premium raw clarity.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmitHarvest = async () => {
    if (!batchId || !botanicalOrigin || !weight || !moisture) {
      alert('Please complete all harvest fields.');
      return;
    }

    try {
      setIsSubmitting(true);

      const batchRecord = {
        batchId,
        botanicalOrigin,
        weight: parseFloat(weight),
        moisture: parseFloat(moisture),
        extractionMethod,
        notes,
        beekeeperName: user?.displayName || user?.name || 'Beekeeper',
        beekeeperUid: user?.uid || 'user_123',
        status: 'HARVESTED',
        createdAt: new Date().toISOString()
      };

      await firestoreService.createBatch(batchRecord);
      await auditService.logAction({
        user,
        action: 'REGISTER_HARVEST',
        entity: 'BATCH',
        entityId: batchId,
        newValue: batchRecord
      });

      setSuccessMsg('Harvest registered successfully! Redirecting to Blockchain Passport creation...');
      setTimeout(() => {
        router.push({
          pathname: '/(app)/batches/create',
          params: { batchId, botanicalOrigin, weight, moisture }
        });
      }, 1500);
    } catch (e) {
      alert('Failed to register harvest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={theme.colors.charcoal} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Register Honey Harvest</Text>
            <Text style={styles.screenSubtitle}>Log new honey extraction batch details</Text>
          </View>
        </View>

        {successMsg ? (
          <View style={styles.successBox}>
            <CheckCircle size={20} color={theme.colors.status.success} style={{ marginRight: 8 }} />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.label}>Batch ID</Text>
          <TextInput style={[styles.input, { backgroundColor: '#EDF2F7' }]} value={batchId} editable={false} />

          <Text style={styles.label}>Botanical Origin</Text>
          <TextInput style={styles.input} value={botanicalOrigin} onChangeText={setBotanicalOrigin} placeholder="e.g. Acacia, Wildflower, Clover" />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.label}>Honey Weight (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.label}>Moisture Content (%)</Text>
              <TextInput style={styles.input} value={moisture} onChangeText={setMoisture} keyboardType="numeric" />
            </View>
          </View>

          <Text style={styles.label}>Extraction Method</Text>
          <TextInput style={styles.input} value={extractionMethod} onChangeText={setExtractionMethod} />

          <Text style={styles.label}>Extraction Notes</Text>
          <TextInput style={[styles.input, { height: 70 }]} multiline value={notes} onChangeText={setNotes} />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitHarvest} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Submit & Create Blockchain Passport</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.main },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 8, borderRadius: 20, backgroundColor: theme.colors.background.card },
  screenTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.charcoal },
  screenSubtitle: { fontSize: 13, color: theme.colors.text.secondary },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
  label: { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary, marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: theme.colors.background.main, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.charcoal },
  row: { flexDirection: 'row' },
  submitBtn: { backgroundColor: theme.colors.primaryDark, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', padding: 12, borderRadius: 12, marginBottom: 16 },
  successText: { color: theme.colors.status.success, fontWeight: '700', fontSize: 13, flex: 1 }
});
