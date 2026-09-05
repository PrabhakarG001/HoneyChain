import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { QrCode, ArrowLeft, Search, ShieldCheck, Camera, Sparkles } from 'lucide-react-native';
import { firestoreService } from '../../../services/firestore.service';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function QRScannerScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyCode = async (codeToVerify) => {
    const code = (codeToVerify || manualCode).trim();
    if (!code) {
      Alert.alert('Input Required', 'Please enter or scan a product QR verification code.');
      return;
    }

    try {
      setIsVerifying(true);
      const product = await firestoreService.resolveQRCode(code);
      if (product) {
        router.push({
          pathname: `/verify/${product.id}`,
          params: { qrId: code },
        });
      } else {
        router.push({
          pathname: `/verify/${code}`,
          params: { qrId: code },
        });
      }
    } catch (err) {
      console.warn('QR Lookup error:', err);
      router.push({
        pathname: `/verify/${code}`,
        params: { qrId: code },
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Honey Provenance Verifier</Text>
      </View>

      <View style={styles.content}>
        {/* Camera Simulation View */}
        <View style={[styles.scannerWindow, { backgroundColor: colors.card }]}>
          <View style={styles.scanFrame}>
            <QrCode size={120} color="#F59E0B" style={{ opacity: 0.8 }} />
            <Text style={[styles.scanInstruction, { color: colors.subtext }]}>Align QR code on Honey Jar within frame</Text>
          </View>

          <TouchableOpacity 
            style={styles.simScanBtn}
            onPress={() => handleVerifyCode('QR_SAMPLE_PROD_108')}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.simScanBtnText}>Simulate Camera Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Manual Input Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.subtext }]}>OR ENTER CODE MANUALLY</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Manual Entry */}
        <View style={[styles.manualCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.manualTitle, { color: colors.text }]}>QR Verification Code</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="e.g. QR_17109281_A9"
              placeholderTextColor={colors.subtext}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={[styles.searchBtn, isVerifying && { opacity: 0.7 }]}
              onPress={() => handleVerifyCode()}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Search size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sample Quick Codes */}
        <View style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.quickTitle, { color: colors.subtext }]}>Try Sample Verified Honey Batches:</Text>
          <View style={styles.chipRow}>
            {['HC-JAR-8841', 'HC-JAR-9012', 'HC-JAR-7719'].map((sample) => (
              <TouchableOpacity
                key={sample}
                style={[styles.chip, { backgroundColor: colors.isDark ? '#3B2D05' : '#FEF3C7' }]}
                onPress={() => handleVerifyCode(sample)}
              >
                <Sparkles size={14} color="#D97706" />
                <Text style={[styles.chipText, { color: colors.isDark ? '#F59E0B' : '#92400E' }]}>{sample}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
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
    flex: 1,
    padding: 16,
  },
  scannerWindow: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanFrame: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  scanInstruction: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 12,
  },
  simScanBtn: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  simScanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  manualCard: {
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
  },
  manualTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 8,
  },
  searchBtn: {
    backgroundColor: '#D97706',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
