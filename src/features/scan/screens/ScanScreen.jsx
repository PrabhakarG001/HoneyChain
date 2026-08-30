import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Scan, X } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './ScanScreen.styles';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Honey</Text>
        <Text style={styles.subtitle}>Scan the QR code to discover the complete journey of this honey.</Text>
      </View>

      <View style={styles.scannerContainer}>
        {/* Placeholder for camera view */}
        <View style={styles.cameraPlaceholder}>
          <Scan size={64} color={theme.colors.white} opacity={0.5} />
          
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => setScanning(!scanning)}
        >
          <Text style={styles.scanButtonText}>
            {scanning ? 'Cancel Scanning' : 'Start Scanning'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
