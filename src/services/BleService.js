import { BleManager } from 'react-native-ble-plx';
import { Platform } from 'react-native';

class BleService {
  constructor() {
    if (Platform.OS !== 'web') {
      this.manager = new BleManager();
    }
    this.device = null;
  }

  scanForDevices(onDeviceFound) {
    if (!this.manager) return;

    this.manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.error('BLE Scan Error:', error);
        return;
      }
      
      // Typical ESP32 BLE name or service UUID filtering
      if (scannedDevice && scannedDevice.name && scannedDevice.name.includes('HoneyChain')) {
        onDeviceFound(scannedDevice);
      }
    });
  }

  stopScan() {
    if (this.manager) {
      this.manager.stopDeviceScan();
    }
  }

  async connectToDevice(deviceId) {
    if (!this.manager) return null;
    
    try {
      this.stopScan();
      const connectedDevice = await this.manager.connectToDevice(deviceId);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      this.device = connectedDevice;
      return connectedDevice;
    } catch (error) {
      console.error('BLE Connection Error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.device) {
      await this.device.cancelConnection();
      this.device = null;
    }
  }

  // Simulated method for reading batched data. 
  // In reality, you'd read from specific service and characteristic UUIDs.
  async readBatchedData(serviceUUID, characteristicUUID) {
    if (!this.device) throw new Error('Not connected to a BLE device');
    
    // const characteristic = await this.device.readCharacteristicForService(serviceUUID, characteristicUUID);
    // const decodedData = atob(characteristic.value); // Base64 decode
    // return JSON.parse(decodedData);
    
    // Simulating batched data retrieval
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { timestamp: new Date().toISOString(), temperature: 35.2, humidity: 45, weight: 60.5, soundLevel: 42 },
          { timestamp: new Date(Date.now() - 3600000).toISOString(), temperature: 34.8, humidity: 46, weight: 60.4, soundLevel: 40 },
          { timestamp: new Date(Date.now() - 7200000).toISOString(), temperature: 34.5, humidity: 47, weight: 60.4, soundLevel: 39 },
        ]);
      }, 1500);
    });
  }
}

export default new BleService();
