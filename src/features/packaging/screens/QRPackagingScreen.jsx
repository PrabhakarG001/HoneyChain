import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QrCode, ArrowLeft, PackageCheck, CheckCircle2, Box, Sparkles } from 'lucide-react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';

export default function QRPackagingScreen() {
  const router = useRouter();
  const { batchId: paramBatchId } = useLocalSearchParams();

  const [batchId, setBatchId] = useState(paramBatchId || 'HC-BATCH-901');
  const [productName, setProductName] = useState('HoneyChain Organic Raw Acacia Honey');
  const [netWeight, setNetWeight] = useState('500g');
  const [price, setPrice] = useState('24.99');
  const [jarCount, setJarCount] = useState('100');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState(null);

  const handleGenerateQRPackage = async () => {
    if (!productName.trim() || !batchId.trim()) {
      Alert.alert('Validation Error', 'Please complete all product packaging fields.');
      return;
    }

    try {
      setIsGenerating(true);

      const productData = {
        batchId,
        productName,
        netWeight,
        price: parseFloat(price) || 24.99,
        jarCount: parseInt(jarCount) || 100,
        purityScore: 98,
        organicSeal: true,
        verifiedStatus: 'AUTHENTIC',
        blockchainTx: '0x8f3c92a71b4e061d9a2c4e5f6071a93e811b',
      };

      const result = await firestoreService.createProductWithQR(productData);
      await auditService.logAction('QR_PACKAGING_GENERATED', {
        productId: result.id,
        qrId: result.qrId,
        batchId,
      });

      setGeneratedProduct(result);
      Alert.alert('QR Packaging Success', `Generated QR Code [${result.qrId}] linked to Batch ${batchId}`);
    } catch (err) {
      console.error('Failed to generate QR packaging:', err);
      Alert.alert('Error', 'Failed to generate QR packaging.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code Packaging Workflow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro Banner */}
        <View style={styles.banner}>
          <PackageCheck size={32} color="#4F46E5" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.bannerTitle}>Batch Bottling & Provenance QR</Text>
            <Text style={styles.bannerSub}>Generate tampered-proof consumer QR codes linked directly to the on-chain passport.</Text>
          </View>
        </View>

        {/* Product Details Form */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Packaging Specs</Text>

          <Text style={styles.inputLabel}>Source Batch ID</Text>
          <TextInput
            style={styles.input}
            value={batchId}
            onChangeText={setBatchId}
            placeholder="e.g. HC-BATCH-901"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Product Title</Text>
          <TextInput
            style={styles.input}
            value={productName}
            onChangeText={setProductName}
            placeholder="e.g. HoneyChain Raw Acacia Honey"
            placeholderTextColor="#9CA3AF"
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Net Weight</Text>
              <TextInput
                style={styles.input}
                value={netWeight}
                onChangeText={setNetWeight}
                placeholder="500g"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Retail Price ($)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="24.99"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Lot Batch Size (Jar Count)</Text>
          <TextInput
            style={styles.input}
            value={jarCount}
            onChangeText={setJarCount}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Live Generated QR Result */}
        {generatedProduct && (
          <View style={styles.qrResultCard}>
            <View style={{ alignItems: 'center' }}>
              <Sparkles size={24} color="#10B981" />
              <Text style={styles.qrResultTitle}>Consumer QR Label Preview</Text>
              <Text style={styles.qrResultSub}>Scan ID: {generatedProduct.qrId}</Text>
            </View>

            <View style={styles.qrBox}>
              <QRCodeSVG
                value={`https://honeychain.io/verify/${generatedProduct.qrId}`}
                size={180}
                color="#0F172A"
                backgroundColor="#FFFFFF"
              />
            </View>

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Product:</Text>
                <Text style={styles.detailValue}>{generatedProduct.productName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Linked Batch:</Text>
                <Text style={styles.detailValue}>{generatedProduct.batchId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Purity Score:</Text>
                <Text style={[styles.detailValue, { color: '#10B981' }]}>{generatedProduct.purityScore}/100</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.printBtn}
              onPress={() => Alert.alert('Print Queue', `Sending QR label batch for ${generatedProduct.qrId} to printing station.`)}
            >
              <Text style={styles.printBtnText}>Send to Label Printer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionBtn, isGenerating && { opacity: 0.7 }]}
          onPress={handleGenerateQRPackage}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <QrCode size={20} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Mint & Link QR Code Label</Text>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3730A3',
  },
  bannerSub: {
    fontSize: 13,
    color: '#4338CA',
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
  qrResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  qrResultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  qrResultSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  qrBox: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  detailList: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  printBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  printBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
