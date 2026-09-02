import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QrCode, Share, Printer } from 'lucide-react-native';

export default function BottlingStation() {
  const [batchId, setBatchId] = useState('');
  const [bottlingDate, setBottlingDate] = useState(new Date().toISOString().split('T')[0]);
  const [units, setUnits] = useState('10');
  const [generatedCodes, setGeneratedCodes] = useState([]);
  let svgRefs = [];

  const handleGenerate = () => {
    if (!batchId || !units || isNaN(units)) {
      Alert.alert('Error', 'Please enter a valid Batch ID and Number of Units.');
      return;
    }

    const numUnits = parseInt(units, 10);
    const codes = Array.from({ length: numUnits }).map((_, i) => {
      const id = `PROD_${String(i + 1).padStart(4, '0')}`;
      return { id, batchId, date: bottlingDate };
    });
    setGeneratedCodes(codes);
  };

  const handleShare = (index) => {
    // In a real app, use expo-sharing to share the base64 SVG or PNG
    const svgRef = svgRefs[index];
    if (svgRef) {
      svgRef.toDataURL((data) => {
        console.log(`Mock Share QR Data: data:image/png;base64,${data.substring(0, 50)}...`);
        Alert.alert('Success', 'QR Code saved to clipboard/gallery! (Simulated)');
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>Product Bottling</Text>
        
        <Text style={styles.label}>Processing Batch ID</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., BATCH_X" 
          value={batchId} 
          onChangeText={setBatchId} 
        />

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Bottling Date</Text>
            <TextInput 
              style={styles.input} 
              value={bottlingDate} 
              onChangeText={setBottlingDate} 
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Number of Units</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="number-pad" 
              value={units} 
              onChangeText={setUnits} 
            />
          </View>
        </View>

        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <QrCode color="#fff" size={20} />
          <Text style={styles.btnText}>Generate Product Codes</Text>
        </TouchableOpacity>
      </View>

      {generatedCodes.length > 0 && (
        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
          <Text style={styles.resultsTitle}>Generated Labels ({generatedCodes.length})</Text>
          <View style={styles.grid}>
            {generatedCodes.map((code, index) => (
              <View key={code.id} style={styles.qrCard}>
                <QRCode
                  value={`https://honeychain.app/verify/${code.id}`}
                  size={120}
                  getRef={(c) => (svgRefs[index] = c)}
                  color="#111827"
                  backgroundColor="#fff"
                />
                <Text style={styles.qrId}>{code.id}</Text>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(index)}>
                    <Share size={16} color="#4B5563" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Printer size={16} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  generateBtn: {
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 40,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  qrCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 160,
  },
  qrId: {
    marginTop: 12,
    fontWeight: '700',
    color: '#111827',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  }
});
