import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../../theme';

export default function AccessRestrictedModal({ isVisible = true, onClose, requiredRole = 'BEEKEEPER' }) {
  const router = useRouter();

  const handleGoHome = () => {
    if (onClose) onClose();
    router.replace('/(app)/(tabs)');
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <ShieldAlert size={40} color="#DC2626" />
          </View>

          <Text style={styles.title}>Access Restricted</Text>
          <Text style={styles.message}>
            You don't have permission to access this page. This area requires {requiredRole} privileges.
          </Text>

          <TouchableOpacity style={styles.goHomeBtn} onPress={handleGoHome}>
            <Home size={18} color="#FFFFFF" />
            <Text style={styles.goHomeText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  goHomeBtn: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '100%',
    gap: 8,
  },
  goHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
