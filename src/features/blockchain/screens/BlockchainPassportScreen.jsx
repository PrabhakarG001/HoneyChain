import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldCheck, Copy, ExternalLink, ArrowLeft, Cpu, CheckCircle2, Lock, FileCode, Layers } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '../../../theme';
import { auditService } from '../../../services/audit.service';

export default function BlockchainPassportScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blockchain Honey Passport</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <ShieldCheck size={36} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.statusTitle}>{passportData.status}</Text>
              <Text style={styles.statusSub}>Cryptographically anchored on-chain</Text>
            </View>
          </View>
        </View>

        {/* QR Code Anchor */}
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>On-Chain Provenance QR</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={`https://honeychain.io/passport/${passportData.batchId}`}
              size={160}
              color="#1E293B"
              backgroundColor="#FFFFFF"
            />
          </View>
          <Text style={styles.batchCode}>Batch Code: {passportData.batchId}</Text>
        </View>

        {/* Blockchain Metadata */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Smart Contract Details</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Network</Text>
            <Text style={styles.value}>{passportData.network}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Block Number</Text>
            <Text style={styles.value}>#{passportData.blockNumber}</Text>
          </View>

          <View style={styles.rowStack}>
            <Text style={styles.label}>Transaction Hash</Text>
            <TouchableOpacity style={styles.copyBox} onPress={handleCopyHash}>
              <Text style={styles.hashText} numberOfLines={1} ellipsisMode="middle">
                {passportData.txHash}
              </Text>
              <Copy size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowStack}>
            <Text style={styles.label}>Smart Contract Address</Text>
            <View style={styles.copyBox}>
              <Text style={styles.hashText} numberOfLines={1} ellipsisMode="middle">
                {passportData.contractAddress}
              </Text>
              <FileCode size={16} color="#4F46E5" />
            </View>
          </View>

          <View style={styles.rowStack}>
            <Text style={styles.label}>Merkle State Root</Text>
            <View style={styles.copyBox}>
              <Text style={styles.hashText} numberOfLines={1} ellipsisMode="middle">
                {passportData.merkleRoot}
              </Text>
              <Lock size={16} color="#6B7280" />
            </View>
          </View>
        </View>

        {/* Immutable Provenance Records */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Immutable Provenance Ledger</Text>
          
          <View style={styles.ledgerItem}>
            <CheckCircle2 size={18} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.ledgerText}>Apiary Harvest Registered</Text>
              <Text style={styles.ledgerSub}>{passportData.beekeeper} • {passportData.apiaryLocation}</Text>
            </View>
          </View>

          <View style={styles.ledgerItem}>
            <CheckCircle2 size={18} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.ledgerText}>Botanical & Purity Verified</Text>
              <Text style={styles.ledgerSub}>{passportData.floralOrigin} • Purity: {passportData.purityIndex}%</Text>
            </View>
          </View>

          <View style={styles.ledgerItem}>
            <CheckCircle2 size={18} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.ledgerText}>Lab Certification Passed</Text>
              <Text style={styles.ledgerSub}>Pollen: {passportData.pollenCount}</Text>
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
  statusCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
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
    color: '#065F46',
  },
  statusSub: {
    fontSize: 13,
    color: '#047857',
    marginTop: 2,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: '#FFFFFF',
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
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowStack: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  copyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  hashText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#334155',
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
    color: '#1E293B',
  },
  ledgerSub: {
    fontSize: 12,
    color: '#64748B',
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
