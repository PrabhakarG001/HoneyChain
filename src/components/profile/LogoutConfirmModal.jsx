import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useAuthStore } from '../../store/auth.store';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function LogoutConfirmModal({ isVisible, onClose }) {
  const { logout: authContextLogout } = useAuth();
  const { logout: storeLogout } = useAuthStore();
  const colors = useThemeColors();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (authContextLogout) {
        await authContextLogout();
      } else {
        await storeLogout();
      }
      onClose();
      router.replace('/(auth)/role-selection');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              
              <View style={[styles.iconCircle, { backgroundColor: colors.isDark ? '#3F1D1D' : '#FEE2E2' }]}>
                <LogOut size={28} color="#EF4444" style={{ marginLeft: 2 }} />
              </View>

              <Text style={[styles.title, { color: colors.text }]}>Log out of HoneyChain?</Text>
              <Text style={[styles.subtitle, { color: colors.subtext }]}>
                Are you sure you want to log out? You will need to sign in again to access your hives, IoT telemetries, and verified honey passport records.
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onClose} disabled={isLoggingOut}>
                  <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleConfirmLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.logoutText}>Log Out</Text>
                  )}
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
