import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Scan, X, Globe } from 'lucide-react-native';
import { theme } from '../../../theme';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';
import styles from './ScanScreen.styles';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const { t, currentLanguage } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('scanHoney', 'Scan Honey')}</Text>
          <Text style={styles.subtitle}>{t('scanSubtitle', 'Scan the QR code to discover the complete journey of this honey.')}</Text>
        </View>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          onPress={() => setIsLangModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Select language"
        >
          <Globe size={16} color="#F4B942" />
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>{currentLanguage.native}</Text>
        </TouchableOpacity>
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
            {scanning ? t('cancelScanning', 'Cancel Scanning') : t('startScanning', 'Start Scanning')}
          </Text>
        </TouchableOpacity>
      </View>

      <LanguageModal 
        visible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
      />
    </SafeAreaView>
  );
}
