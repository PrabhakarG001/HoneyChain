import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QrCode, ArrowLeft, PackageCheck, CheckCircle2, Box, Sparkles } from 'lucide-react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function QRPackagingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>QR Code Packaging Workflow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro Banner */}
        <View style={[styles.banner, { backgroundColor: colors.isDark ? '#1E1B4B' : '#EEF2FF', borderColor: colors.isDark ? '#312E81' : '#C7D2FE' }]}>
          <PackageCheck size={32} color={colors.isDark ? '#818CF8' : '#4F46E5'} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.bannerTitle, { color: colors.isDark ? '#A5B4FC' : '#3730A3' }]}>Batch Bottling & Provenance QR</Text>
            <Text style={[styles.bannerSub, { color: colors.isDark ? '#C7D2FE' : '#4338CA' }]}>Generate tampered-proof consumer QR codes linked directly to the on-chain passport.</Text>
          </View>
        </View>

        {/* Product Details Form */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Packaging Specs</Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Source Batch ID</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={batchId}
            onChangeText={setBatchId}
            placeholder="e.g. HC-BATCH-901"
            placeholderTextColor={colors.subtext}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>Product Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={productName}
            onChangeText={setProductName}
            placeholder="e.g. HoneyChain Raw Acacia Honey"
            placeholderTextColor={colors.subtext}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Net Weight</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={netWeight}
                onChangeText={setNetWeight}
                placeholder="500g"
                placeholderTextColor={colors.subtext}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Retail Price ($)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="24.99"
                placeholderTextColor={colors.subtext}
              />
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Lot Batch Size (Jar Count)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={jarCount}
            onChangeText={setJarCount}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={colors.subtext}
          />
        </View>

        {/* Live Generated QR Result */}
        {generatedProduct && (
          <View style={[styles.qrResultCard, { backgroundColor: colors.surface, borderColor: colors.isDark ? '#059669' : '#10B981' }]}>
            <View style={{ alignItems: 'center' }}>
              <Sparkles size={24} color="#10B981" />
              <Text style={[styles.qrResultTitle, { color: colors.text }]}>Consumer QR Label Preview</Text>
              <Text style={[styles.qrResultSub, { color: colors.subtext }]}>Scan ID: {generatedProduct.qrId}</Text>
            </View>

            <View style={[styles.qrBox, { backgroundColor: '#FFFFFF' }]}>
              <QRCodeSVG
                value={`https://honeychain.io/verify/${generatedProduct.qrId}`}
                size={180}
                color="#0F172A"
                backgroundColor="#FFFFFF"
              />
            </View>

            <View style={[styles.detailList, { backgroundColor: colors.background }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>Product:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{generatedProduct.productName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>Linked Batch:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{generatedProduct.batchId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>Purity Score:</Text>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSub: {
    fontSize: 13,
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
  qrResultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  qrResultTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  qrResultSub: {
    fontSize: 13,
    marginTop: 2,
  },
  qrBox: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  detailList: {
    width: '100%',
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
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
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
