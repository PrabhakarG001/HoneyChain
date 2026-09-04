import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, PlusCircle, QrCode, Camera, SmartphoneNfc, Factory, X, Heart } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function CreateMenu({ isVisible, onClose }) {
  const router = useRouter();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const userRole = (user?.role || 'BEEKEEPER').toUpperCase();
  const isCustomer = userRole === 'CUSTOMER';

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const BEEKEEPER_ITEMS = [
    { id: 'add_hive', title: 'Add a Hive', subtitle: 'Track a new hive in your apiary', icon: PlusCircle, route: '/hives/add' },
    { id: 'record_harvest', title: 'Record Harvest', subtitle: 'Log a new honey extraction', icon: Box, route: '/harvests/register' },
    { id: 'add_batch', title: 'Create Honey Passport', subtitle: 'Mint a new verified batch', icon: QrCode, route: '/batches/create' },
    { id: 'blockchain_passport', title: 'Blockchain Passport', subtitle: 'View on-chain cryptographic details', icon: QrCode, route: '/blockchain/passport' },
    { id: 'ai_inspection', title: 'AI Inspection', subtitle: 'Analyze sticky board via Camera', icon: Camera, route: '/camera' },
    { id: 'sync_hives', title: 'Sync Hives', subtitle: 'Download offline BLE sensor data', icon: SmartphoneNfc, route: '/sync' },
  ];

  const PROCESSOR_ITEMS = [
    { id: 'processor_portal', title: 'Processor Batch Portal', subtitle: 'Merge batches & process honey', icon: Factory, route: '/processor' },
    { id: 'qr_packaging', title: 'QR Bottling & Packaging', subtitle: 'Generate consumer QR codes', icon: QrCode, route: '/packaging/qr' },
    { id: 'register_harvest', title: 'Record Batch Intake', subtitle: 'Register incoming honey harvest', icon: Box, route: '/harvests/register' },
  ];

  const LAB_ITEMS = [
    { id: 'lab_test', title: 'Register Lab Analysis', subtitle: 'Certificate pollen, HMF, C4 sugar tests', icon: Factory, route: '/lab/register' },
    { id: 'batch_inspection', title: 'Batch Quality Review', subtitle: 'Review batch purity scores', icon: Box, route: '/processor' },
  ];

  const CUSTOMER_ITEMS = [
    { id: 'scan_qr', title: 'Scan Jar QR Code', subtitle: 'Verify honey authenticity on-chain', icon: QrCode, route: '/verify/scan' },
    { id: 'marketplace', title: 'Honey Discovery Store', subtitle: 'Buy 100% verified pure honey', icon: Box, route: '/marketplace' },
    { id: 'support_beekeeper', title: 'Support Local Beekeeper', subtitle: 'Send web3 tips directly to beekeepers', icon: Heart, route: '/(app)/(tabs)/profile' },
  ];

  const ADMIN_ITEMS = [
    { id: 'admin_dashboard', title: 'Admin Overview', subtitle: 'System metrics & overview', icon: Factory, route: '/admin' },
    { id: 'user_rbac', title: 'User RBAC Management', subtitle: 'Assign roles & permissions', icon: PlusCircle, route: '/admin/users' },
    { id: 'organic_certs', title: 'Organic Certifications', subtitle: 'Approve or revoke organic seals', icon: QrCode, route: '/admin/certifications' },
    { id: 'system_health', title: 'System & IoT Telemetry', subtitle: 'Monitor MQTT brokers & API health', icon: SmartphoneNfc, route: '/admin/system' },
  ];

  let menuItems = BEEKEEPER_ITEMS;
  if (userRole === 'PROCESSOR') menuItems = PROCESSOR_ITEMS;
  else if (userRole === 'LAB') menuItems = LAB_ITEMS;
  else if (userRole === 'CUSTOMER') menuItems = CUSTOMER_ITEMS;
  else if (userRole === 'ADMIN' || userRole === 'INSPECTOR') menuItems = ADMIN_ITEMS;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  const handlePress = (route) => {
    onClose();
    if (route) {
      setTimeout(() => {
        router.push(route);
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[
              styles.sheet, 
              { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                transform: [{ translateY: slideAnim }] 
              }
            ]}>
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>{isCustomer ? 'Customer Actions' : 'Create'}</Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.list}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[styles.listItem, { borderBottomColor: colors.border }]}
                      onPress={() => handlePress(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                        <Icon size={20} color={colors.accent} strokeWidth={2} />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.itemSubtitle, { color: colors.subtext }]}>{item.subtitle}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderBottomWidth: 0.5,
    gap: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
