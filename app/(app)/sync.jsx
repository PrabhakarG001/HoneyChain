import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import BleService from '../../src/services/BleService';
import { insertBatchedData } from '../../src/services/DatabaseService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bluetooth, BluetoothSearching, CheckCircle, SmartphoneNfc } from 'lucide-react-native';

export default function SyncScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    return () => {
      BleService.stopScan();
      BleService.disconnect();
    };
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    setSyncMessage('');
    BleService.scanForDevices((device) => {
      setDevices((prev) => {
        if (!prev.find((d) => d.id === device.id)) {
          return [...prev, device];
        }
        return prev;
      });
    });

    setTimeout(() => {
      BleService.stopScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectAndSync = async (device) => {
    setIsSyncing(true);
    setSyncMessage(`Connecting to ${device.name || 'Unknown'}...`);
    try {
      const connected = await BleService.connectToDevice(device.id);
      setConnectedDevice(connected);
      setSyncMessage('Downloading batched data...');
      
      const batchedData = await BleService.readBatchedData();
      await insertBatchedData('hive-123', batchedData);
      
      setSyncMessage('Sync complete! Data saved locally.');
      await BleService.disconnect();
      setConnectedDevice(null);
    } catch (error) {
      setSyncMessage('Sync failed. Please try again.');
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SmartphoneNfc size={32} color="#1D4ED8" />
        <Text style={styles.title}>Hive Sync</Text>
      </View>
      <Text style={styles.subtitle}>Connect via Bluetooth to download offline sensor data.</Text>

      <TouchableOpacity 
        style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
        onPress={startScan}
        disabled={isScanning || isSyncing}
      >
        {isScanning ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <BluetoothSearching size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Scan for Hives</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.statusText}>{syncMessage}</Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.deviceItem}
            onPress={() => connectAndSync(item)}
            disabled={isSyncing}
          >
            <View style={styles.deviceInfo}>
              <Bluetooth size={24} color="#4B5563" />
              <View style={styles.deviceText}>
                <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </View>
            </View>
            {connectedDevice?.id === item.id ? (
              <ActivityIndicator color="#1D4ED8" />
            ) : (
              <Text style={styles.connectText}>Connect</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isScanning && devices.length === 0 ? (
            <Text style={styles.emptyText}>No hives found nearby.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#1D4ED8',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scanButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    textAlign: 'center',
    color: '#059669',
    fontWeight: '500',
    marginBottom: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceText: {
    flexDirection: 'column',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  deviceId: {
    fontSize: 12,
    color: '#6B7280',
  },
  connectText: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 32,
  }
});
