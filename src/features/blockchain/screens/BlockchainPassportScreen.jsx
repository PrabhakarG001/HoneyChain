import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldCheck, Copy, ExternalLink, ArrowLeft, Cpu, CheckCircle2, Lock, FileCode, Layers } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '../../../theme';
import { auditService } from '../../../services/audit.service';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function BlockchainPassportScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { batchId = 'HC-2026-8841', txHash = '0x8f3c92a71b4e061d9a2c4e5f6071a93e811b' } = useLocalSearchParams();
  const [copied, setCopied] = useState(false);

  const passportData = {
    batchId,
    txHash,
    blockNumber: '19,482,109',
    contractAddress: '0x49B3c823091fA0198e3bA18f8B901C4a9812A980',
    network: 'HoneyChain L2 (Polygon / Ethereum PoS)',
    status: 'VERIFIED & IMMUTABLE',
    timestamp: new Date().toISOString(),
    purityIndex: 98,
    pollenCount: '42,000 grains/g',
    floralOrigin: 'Wild Acacia & Lavender',
    beekeeper: 'Master Beekeeper Prabhakar',
    apiaryLocation: 'Green Valley Apiary (37.7749° N, 122.4194° W)',
    merkleRoot: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  };

  const handleCopyHash = () => {
    setCopied(true);
    Alert.alert('Copied!', 'Transaction hash copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
    auditService.logAction('BLOCKCHAIN_HASH_COPIED', { batchId, txHash });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Blockchain Honey Passport</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5', borderColor: colors.isDark ? '#047857' : '#A7F3D0' }]}>
          <View style={styles.statusHeader}>
            <ShieldCheck size={36} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.statusTitle, { color: colors.isDark ? '#34D399' : '#065F46' }]}>{passportData.status}</Text>
              <Text style={[styles.statusSub, { color: colors.isDark ? '#6EE7B7' : '#047857' }]}>Cryptographically anchored on-chain</Text>
            </View>
          </View>
        </View>

        {/* QR Code Anchor */}
        <View style={[styles.qrCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.qrTitle, { color: colors.text }]}>On-Chain Provenance QR</Text>
          <View style={[styles.qrWrapper, { backgroundColor: '#FFFFFF' }]}>
            <QRCode
              value={`https://honeychain.io/passport/${passportData.batchId}`}
              size={160}
              color="#1E293B"
              backgroundColor="#FFFFFF"
            />
          </View>
          <Text style={[styles.batchCode, { color: colors.subtext }]}>Batch Code: {passportData.batchId}</Text>
        </View>

        {/* Blockchain Metadata */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Smart Contract Details</Text>
          
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Network</Text>
            <Text style={[styles.value, { color: colors.text }]}>{passportData.network}</Text>
          </View>
          
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Block Number</Text>
            <Text style={[styles.value, { color: colors.text }]}>#{passportData.blockNumber}</Text>
          </View>

          <View style={[styles.rowStack, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Transaction Hash</Text>
            <TouchableOpacity style={[styles.copyBox, { backgroundColor: colors.background }]} onPress={handleCopyHash}>
              <Text style={[styles.hashText, { color: colors.text }]} numberOfLines={1} ellipsisMode="middle">
                {passportData.txHash}
              </Text>
              <Copy size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          <View style={[styles.rowStack, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Smart Contract Address</Text>
            <View style={[styles.copyBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.hashText, { color: colors.text }]} numberOfLines={1} ellipsisMode="middle">
                {passportData.contractAddress}
              </Text>
              <FileCode size={16} color="#4F46E5" />
            </View>
          </View>

          <View style={[styles.rowStack, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subtext }]}>Merkle State Root</Text>
            <View style={[styles.copyBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.hashText, { color: colors.text }]} numberOfLines={1} ellipsisMode="middle">
                {passportData.merkleRoot}
              </Text>
              <Lock size={16} color={colors.subtext} />
            </View>
          </View>
        </View>

        {/* Immutable Provenance Records */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Immutable Provenance Ledger</Text>
          
          <View style={styles.ledgerItem}>
            <CheckCircle2 size={18} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.ledgerText, { color: colors.text }]}>Apiary Harvest Registered</Text>
              <Text style={[styles.ledgerSub, { color: colors.subtext }]}>{passportData.beekeeper} • {passportData.apiaryLocation}</Text>
            </View>
          </View>

          <View style={styles.ledgerItem}>
            <CheckCircle2 size={18} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.ledgerText, { color: colors.text }]}>Botanical & Purity Verified</Text>
              <Text style={[styles.ledgerSub, { color: colors.subtext }]}>{passportData.floralOrigin} • Purity: {passportData.purityIndex}%</Text>
            </View>
          </View>

          <View style={styles.ledgerItem}>
            <CheckCircle2 size={18} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.ledgerText, { color: colors.text }]}>Lab Certification Passed</Text>
              <Text style={[styles.ledgerSub, { color: colors.subtext }]}>Pollen: {passportData.pollenCount}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.explorerBtn}
          onPress={() => Alert.alert('Block Explorer', `Opening blockchain record for ${passportData.txHash}`)}
        >
          <ExternalLink size={20} color="#FFFFFF" />
          <Text style={styles.explorerBtnText}>View on Block Explorer</Text>
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
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusSub: {
    fontSize: 13,
    marginTop: 2,
  },
  qrCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  qrWrapper: {
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  batchCode: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  rowStack: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
  copyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  hashText: {
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 8,
  },
  ledgerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  ledgerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ledgerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  explorerBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  explorerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
