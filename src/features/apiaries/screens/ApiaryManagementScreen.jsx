import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { MapPin, Plus, Edit2, Trash2, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { firestoreService } from '../../../services/firestore.service';
import TopHeader from '../../../components/navigation/TopHeader';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function ApiaryManagementScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [apiaries, setApiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('37.7749');
  const [lng, setLng] = useState('-122.4194');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadApiaries();
  }, []);

  const loadApiaries = async () => {
    try {
      setIsLoading(true);
      const data = await firestoreService.getAllApiaries();
      if (data && data.length > 0) {
        setApiaries(data);
      } else {
        setApiaries([
          { id: 'apiary-01', name: 'Alpha Meadow Apiary', location: 'Sunny Valley', latitude: '37.7749', longitude: '-122.4194', hiveCount: 8, status: 'Active' },
          { id: 'apiary-02', name: 'Beta Ridge Apiary', location: 'Pine Mountain', latitude: '37.8049', longitude: '-122.4294', hiveCount: 5, status: 'Active' },
        ]);
      }
    } catch (e) {
      console.warn('Failed to load apiaries:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApiary = async () => {
    if (!name || !location) {
      alert('Please fill in Apiary Name and Location');
      return;
    }
    try {
      setIsSubmitting(true);
      const newApiary = await firestoreService.createApiary({
        name,
        location,
        latitude: lat,
        longitude: lng,
        hiveCount: 0,
        status: 'Active'
      });
      setApiaries([newApiary, ...apiaries]);
      setSuccessMsg('Apiary created successfully!');
      setTimeout(() => {
        setIsFormOpen(false);
        setName('');
        setLocation('');
        setSuccessMsg('');
      }, 1200);
    } catch (e) {
      alert('Failed to create apiary. Please try again.');
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
            <Text style={[styles.screenTitle, { color: colors.text }]}>Apiary Management</Text>
            <Text style={[styles.screenSubtitle, { color: colors.subtext }]}>Manage your farm apiary locations & GPS tags</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFormOpen(!isFormOpen)} style={styles.addBtn}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Apiary</Text>
          </TouchableOpacity>
        </View>

        {/* Add Form */}
        {isFormOpen && (
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Apiary Location</Text>
            {successMsg ? (
              <View style={styles.successBox}>
                <CheckCircle size={18} color={theme.colors.status.success} style={{ marginRight: 8 }} />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            ) : null}
            <Text style={[styles.label, { color: colors.subtext }]}>Apiary Name</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} placeholder="e.g. Golden Hills Apiary" placeholderTextColor={colors.subtext} value={name} onChangeText={setName} />
            
            <Text style={[styles.label, { color: colors.subtext }]}>Location / Address</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} placeholder="e.g. Sector 4, Valley Farm" placeholderTextColor={colors.subtext} value={location} onChangeText={setLocation} />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={[styles.label, { color: colors.subtext }]}>Latitude</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} value={lat} onChangeText={setLat} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={[styles.label, { color: colors.subtext }]}>Longitude</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} value={lng} onChangeText={setLng} keyboardType="numeric" />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddApiary} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Save Apiary</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* Apiaries List */}
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.listContainer}>
            {apiaries.map(apiary => (
              <View key={apiary.id} style={[styles.apiaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.isDark ? '#3B2D05' : '#FFFDF0', borderColor: colors.isDark ? '#D97706' : theme.colors.primary }]}>
                    <MapPin size={22} color={colors.isDark ? '#F59E0B' : theme.colors.primaryDark} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.apiaryName, { color: colors.text }]}>{apiary.name}</Text>
                    <Text style={[styles.apiaryLocation, { color: colors.subtext }]}>{apiary.location}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#E6F4EA' }]}>
                    <Text style={[styles.statusText, { color: colors.isDark ? '#34D399' : theme.colors.status.success }]}>{apiary.status || 'Active'}</Text>
                  </View>
                </View>

                <View style={[styles.cardDetails, { borderTopColor: colors.border }]}>
                  <Text style={[styles.detailText, { color: colors.subtext }]}>🐝 Hives: {apiary.hiveCount || 0}</Text>
                  <Text style={[styles.detailText, { color: colors.subtext }]}>📍 GPS: {apiary.latitude || '37.7749'}, {apiary.longitude || '-122.4194'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

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
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D97706', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, gap: 6 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  formCard: { borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1 },
  formTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  input: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  row: { flexDirection: 'row' },
  submitBtn: { backgroundColor: '#D97706', height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', padding: 10, borderRadius: 8, marginBottom: 8 },
  successText: { color: '#10B981', fontWeight: '600', fontSize: 13 },
  listContainer: { gap: 12 },
  apiaryCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  apiaryName: { fontSize: 16, fontWeight: '700' },
  apiaryLocation: { fontSize: 13 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardDetails: { borderTopWidth: 1, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  detailText: { fontSize: 12, fontWeight: '500' }
});
