import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { MapPin, Plus, Edit2, Trash2, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { firestoreService } from '../../../services/firestore.service';
import TopHeader from '../../../components/navigation/TopHeader';

export default function ApiaryManagementScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <TopHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={theme.colors.charcoal} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Apiary Management</Text>
            <Text style={styles.screenSubtitle}>Manage your farm apiary locations & GPS tags</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFormOpen(!isFormOpen)} style={styles.addBtn}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Apiary</Text>
          </TouchableOpacity>
        </View>

        {/* Add Form */}
        {isFormOpen && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Apiary Location</Text>
            {successMsg ? (
              <View style={styles.successBox}>
                <CheckCircle size={18} color={theme.colors.status.success} style={{ marginRight: 8 }} />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            ) : null}
            <Text style={styles.label}>Apiary Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Golden Hills Apiary" value={name} onChangeText={setName} />
            
            <Text style={styles.label}>Location / Address</Text>
            <TextInput style={styles.input} placeholder="e.g. Sector 4, Valley Farm" value={location} onChangeText={setLocation} />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput style={styles.input} value={lat} onChangeText={setLat} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput style={styles.input} value={lng} onChangeText={setLng} keyboardType="numeric" />
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
              <View key={apiary.id} style={styles.apiaryCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <MapPin size={22} color={theme.colors.primaryDark} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.apiaryName}>{apiary.name}</Text>
                    <Text style={styles.apiaryLocation}>{apiary.location}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{apiary.status || 'Active'}</Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <Text style={styles.detailText}>🐝 Hives: {apiary.hiveCount || 0}</Text>
                  <Text style={styles.detailText}>📍 GPS: {apiary.latitude || '37.7749'}, {apiary.longitude || '-122.4194'}</Text>
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
  container: { flex: 1, backgroundColor: theme.colors.background.main },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 8, borderRadius: 20, backgroundColor: theme.colors.background.card },
  screenTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.charcoal },
  screenSubtitle: { fontSize: 13, color: theme.colors.text.secondary },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryDark, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, gap: 6 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
  formTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.charcoal, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary, marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: theme.colors.background.main, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.charcoal },
  row: { flexDirection: 'row' },
  submitBtn: { backgroundColor: theme.colors.primaryDark, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', padding: 10, borderRadius: 8, marginBottom: 8 },
  successText: { color: theme.colors.status.success, fontWeight: '600', fontSize: 13 },
  listContainer: { gap: 12 },
  apiaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFDF0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.primary },
  apiaryName: { fontSize: 16, fontWeight: '700', color: theme.colors.charcoal },
  apiaryLocation: { fontSize: 13, color: theme.colors.text.secondary },
  statusBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, color: theme.colors.status.success, fontWeight: '700' },
  cardDetails: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  detailText: { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '500' }
});
