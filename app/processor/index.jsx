import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Factory, CheckSquare, Square, GitMerge, FileText } from 'lucide-react-native';
import GenealogyGraph from '../../src/features/processor/components/GenealogyGraph';
import BottlingStation from '../../src/features/processor/components/BottlingStation';
import { useRouter } from 'expo-router';
import { batchService } from '../../src/services/batch.service';
import { useAuthStore } from '../../src/store/auth.store';
import AccessRestrictedModal from '../../src/components/ui/AccessRestricted/AccessRestrictedModal';
import { theme } from '../../src/theme';

export default function ProcessorPortal() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userRole = (user?.role || '').toUpperCase();
  const isCustomer = userRole === 'CUSTOMER';

  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [logs, setLogs] = useState({ filtering: false, moisture: false, pasteurization: false });
  const [activeTab, setActiveTab] = useState('merge');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState(null);

  if (isCustomer) {
    return <AccessRestrictedModal isVisible requiredRole="PROCESSOR / BEEKEEPER" />;
  }

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const batches = await batchService.getBatches();
      // Map them to the UI format
      setAvailableBatches((batches || []).map(b => ({
        id: b.id || b._id,
        label: `Batch ${b.id || b._id} - ${b.status || 'Harvested'}`
      })));
    } catch (err) {
      console.error('Failed to fetch batches', err);
      setError('Failed to load batches.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBatch = (id) => {
    setSelectedBatches(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleLog = (key) => {
    setLogs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMerge = async () => {
    if (selectedBatches.length < 2) {
      Alert.alert('Selection Error', 'Please select at least 2 batches to merge.');
      return;
    }

    try {
      setIsMerging(true);
      await batchService.createBatch({
        parents: selectedBatches,
        processingLogs: logs,
      });
      
      Alert.alert('Success', 'Batches successfully merged and recorded on-chain.');
      setSelectedBatches([]);
      setLogs({ filtering: false, moisture: false, pasteurization: false });
      setActiveTab('genealogy');
      fetchBatches(); // refresh available batches
    } catch (e) {
      Alert.alert('Error', 'Failed to merge batches.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Factory color="#1D4ED8" size={24} />
          <Text style={styles.title}>Processor Portal</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {['merge', 'genealogy', 'bottling'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {activeTab === 'merge' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Batch Transformation & Merging</Text>
            
            <Text style={styles.sectionTitle}>1. Select Harvest Batches</Text>
            <View style={styles.list}>
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} style={{ margin: 10 }} />
              ) : error ? (
                <Text style={{ margin: 10, color: theme.colors.status.error }}>{error}</Text>
              ) : availableBatches.length === 0 ? (
                <Text style={{ margin: 10, color: theme.colors.text.secondary }}>No batches available to merge.</Text>
              ) : (
                availableBatches.map(harvest => (
                  <TouchableOpacity 
                    key={harvest.id} 
                    style={[styles.listItem, selectedBatches.includes(harvest.id) && styles.listItemSelected]}
                    onPress={() => toggleBatch(harvest.id)}
                  >
                    <View style={styles.checkbox}>
                      {selectedBatches.includes(harvest.id) ? <CheckSquare size={20} color="#1D4ED8" /> : <Square size={20} color="#9CA3AF" />}
                    </View>
                    <Text style={[styles.listText, selectedBatches.includes(harvest.id) && styles.listTextSelected]}>
                      {harvest.label}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <Text style={styles.sectionTitle}>2. Processing Step Logger</Text>
            <View style={styles.list}>
              {[
                { key: 'filtering', label: 'Filtering (Mesh 400)' },
                { key: 'moisture', label: 'Moisture Reduction (< 18%)' },
                { key: 'pasteurization', label: 'Pasteurization (Flash)' }
              ].map(step => (
                <TouchableOpacity key={step.key} style={styles.listItem} onPress={() => toggleLog(step.key)}>
                  <View style={styles.checkbox}>
                    {logs[step.key] ? <CheckSquare size={20} color="#10B981" /> : <Square size={20} color="#9CA3AF" />}
                  </View>
                  <Text style={styles.listText}>{step.label}</Text>
                  <FileText size={16} color="#6B7280" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.mergeBtn, (selectedBatches.length < 2 || isMerging) && { opacity: 0.7 }]} 
              onPress={handleMerge}
              disabled={selectedBatches.length < 2 || isMerging}
            >
              {isMerging ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <GitMerge color="#fff" size={20} />
                  <Text style={styles.mergeBtnText}>Merge Batches</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'genealogy' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Batch Genealogy Graph</Text>
            <Text style={styles.cardDesc}>Interactive DAG showing the lineage from hives to product units.</Text>
            <GenealogyGraph />
          </View>
        )}

        {activeTab === 'bottling' && (
          <BottlingStation />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    marginBottom: 12,
  },
  backText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1D4ED8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1D4ED8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
  },
  list: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItemSelected: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  checkbox: {
    marginRight: 12,
  },
  listText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  listTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  mergeBtn: {
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  mergeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
