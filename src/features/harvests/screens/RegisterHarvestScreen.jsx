import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { harvestService } from '../../../services/harvest.service';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { useAuthStore } from '../../../store/auth.store';
import { useThemeColors } from '../../../hooks/useThemeColors';
import TopHeader from '../../../components/navigation/TopHeader';

export default function RegisterHarvestScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user } = useAuthStore();

  const [hiveId, setHiveId] = useState('HV_UP_00123');
  const [batchId, setBatchId] = useState(`BATCH_${Math.floor(100000 + Math.random() * 900000)}`);
  const [botanicalOrigin, setBotanicalOrigin] = useState('Acacia Blossom');
  const [weight, setWeight] = useState('250'); // kg
  const [moisture, setMoisture] = useState('17.2'); // %
  const [extractionMethod, setExtractionMethod] = useState('Cold Pressed Centrifuge');
  const [notes, setNotes] = useState('Harvested from Hive 01. Premium raw clarity.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitHarvest = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!hiveId || !weight || parseFloat(weight) <= 0) {
      setErrorMsg('Please enter a valid hive ID and positive harvest weight.');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Submit to FastAPI backend API
      let backendHarvest = null;
      try {
        backendHarvest = await harvestService.createHarvest({
          hive_id: hiveId.trim(),
          weight_kg: parseFloat(weight),
          batch_id: batchId.trim()
        });
      } catch (err) {
        console.warn('Backend harvest creation notice:', err.message);
      }

      // 2. Also log to firestore & audit
      const batchRecord = {
        batchId: batchId.trim(),
        hiveId: hiveId.trim(),
        botanicalOrigin: botanicalOrigin.trim(),
        weight: parseFloat(weight),
        moisture: parseFloat(moisture),
        extractionMethod,
        notes,
        beekeeperName: user?.name || user?.username || 'Beekeeper',
        status: 'HARVESTED',
        createdAt: new Date().toISOString()
      };

      try {
        await firestoreService.createBatch(batchRecord);
        await auditService.logAction({
          user,
          action: 'REGISTER_HARVEST',
          entity: 'BATCH',
          entityId: batchId,
          newValue: batchRecord
        });
      } catch (e) {}

      const createdBatchId = backendHarvest?.data?.batchId || batchRecord.batchId;
      setSuccessMsg('Harvest registered successfully! Redirecting to Blockchain Passport creation...');
      
      setTimeout(() => {
        router.push({
          pathname: '/(app)/batches/create',
          params: { batchId: createdBatchId, hiveId, botanicalOrigin, weight, moisture }
        });
      }, 1200);
    } catch (e) {
      setErrorMsg(e.message || 'Failed to register harvest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Register Honey Harvest</Text>
            <Text style={[styles.screenSubtitle, { color: colors.subtext }]}>Log new honey extraction batch details</Text>
          </View>
        </View>

        {successMsg ? (
          <View style={[styles.successBox, { backgroundColor: colors.isDark ? '#1C3829' : '#E6F4EA' }]}>
            <CheckCircle size={20} color={colors.accent} style={{ marginRight: 8 }} />
            <Text style={[styles.successText, { color: colors.accent }]}>{successMsg}</Text>
          </View>
        ) : null}

        {errorMsg ? (
          <View style={[styles.successBox, { backgroundColor: colors.isDark ? '#3F1D1D' : '#FEE2E2' }]}>
            <Text style={{ color: colors.status.error, fontWeight: '700', fontSize: 13, flex: 1 }}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.subtext }]}>Hive ID</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
            value={hiveId} 
            onChangeText={setHiveId}
            placeholder="HV_UP_00123"
            placeholderTextColor={colors.subtext}
          />

          <Text style={[styles.label, { color: colors.subtext }]}>Batch ID</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
            value={batchId} 
            onChangeText={setBatchId}
          />

          <Text style={[styles.label, { color: colors.subtext }]}>Botanical Origin</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
            value={botanicalOrigin} 
            onChangeText={setBotanicalOrigin} 
            placeholder="e.g. Acacia, Wildflower, Clover"
            placeholderTextColor={colors.subtext}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={[styles.label, { color: colors.subtext }]}>Honey Weight (kg)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
                value={weight} 
                onChangeText={setWeight} 
                keyboardType="numeric" 
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={[styles.label, { color: colors.subtext }]}>Moisture Content (%)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
                value={moisture} 
                onChangeText={setMoisture} 
                keyboardType="numeric" 
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.subtext }]}>Extraction Method</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
            value={extractionMethod} 
            onChangeText={setExtractionMethod} 
          />

          <Text style={[styles.label, { color: colors.subtext }]}>Extraction Notes</Text>
          <TextInput 
            style={[styles.input, { height: 70, backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} 
            multiline 
            value={notes} 
            onChangeText={setNotes} 
          />

          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.accent }]} onPress={handleSubmitHarvest} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="#000000" />
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
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 8, borderRadius: 20 },
  screenTitle: { fontSize: 22, fontWeight: '800' },
  screenSubtitle: { fontSize: 13 },
  formCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 10 },
  input: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  row: { flexDirection: 'row' },
  submitBtn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  submitBtnText: { color: '#000000', fontWeight: '700', fontSize: 14 },
  successBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 16 },
  successText: { fontWeight: '700', fontSize: 13, flex: 1 }
});
