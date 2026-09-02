import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Coins, Wallet } from 'lucide-react-native';

export default function TipBeekeeper({ beekeeperAddress = '0x1234567890123456789012345678901234567890' }) {
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Support Your Local Beekeeper</Text>
        <Text style={styles.subtitle}>Please visit the web portal to connect your crypto wallet.</Text>
      </View>
    );
  }

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending: isSending, isSuccess } = useSendTransaction();
  
  const [amount, setAmount] = useState('0.5');

  const handleTip = () => {
    if (!amount || isNaN(amount)) return;
    sendTransaction({
      to: beekeeperAddress,
      value: parseEther(amount),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Coins color="#EAB308" size={24} />
        <Text style={styles.title}>Support Your Beekeeper</Text>
      </View>

      {!isConnected ? (
        <View style={styles.connectContainer}>
          <Text style={styles.subtitle}>Connect your wallet to send a tip.</Text>
          {connectors.map((connector) => (
            <TouchableOpacity 
              key={connector.uid} 
              style={styles.connectButton}
              onPress={() => connect({ connector })}
              disabled={isConnecting}
            >
              <Wallet color="#fff" size={20} />
              <Text style={styles.connectText}>
                {connector.name}
              </Text>
              {isConnecting && <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.tipContainer}>
          <Text style={styles.connectedText}>Connected: {address?.slice(0,6)}...{address?.slice(-4)}</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={amount ?? ''}
              onChangeText={setAmount}
              placeholder="0.0"
            />
            <Text style={styles.currency}>MATIC</Text>
          </View>

          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleTip}
            disabled={isSending || isSuccess}
          >
            <Text style={styles.sendText}>
              {isSending ? 'Sending...' : isSuccess ? 'Sent!' : 'Send Tip'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.disconnectButton} onPress={() => disconnect()}>
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  connectContainer: {
    alignItems: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 8,
  },
  connectText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  tipContainer: {
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 12,
  },
  currency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  sendButton: {
    backgroundColor: '#10B981',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disconnectButton: {
    padding: 8,
  },
  disconnectText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  }
});
