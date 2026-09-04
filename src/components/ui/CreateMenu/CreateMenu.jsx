import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, PlusCircle, QrCode, Camera, SmartphoneNfc, Factory, X, Heart } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './CreateMenu.styles';
import { useAuthStore } from '../../../store/auth.store';

export default function CreateMenu({ isVisible, onClose }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const userRole = (user?.role || 'BEEKEEPER').toUpperCase();
  const isCustomer = userRole === 'CUSTOMER';

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const BEEKEEPER_ITEMS = [
    { id: 'add_hive', title: 'Add a Hive', subtitle: 'Track a new hive in your apiary', icon: PlusCircle, route: '/hives/add' },
    { id: 'record_harvest', title: 'Record Harvest', subtitle: 'Log a new honey extraction', icon: Box, route: '/farms/add' },
    { id: 'add_batch', title: 'Create Honey Passport', subtitle: 'Mint a new verified batch', icon: QrCode, route: '/batches/create' },
    { id: 'blockchain_passport', title: 'Blockchain Passport', subtitle: 'View on-chain cryptographic details', icon: QrCode, route: '/blockchain/passport' },
    { id: 'ai_inspection', title: 'AI Inspection', subtitle: 'Analyze sticky board via Camera', icon: Camera, route: '/camera' },
    { id: 'sync_hives', title: 'Sync Hives', subtitle: 'Download offline BLE sensor data', icon: SmartphoneNfc, route: '/sync' },
  ];

  const PROCESSOR_ITEMS = [
    { id: 'processor_portal', title: 'Processor Batch Portal', subtitle: 'Merge batches & process honey', icon: Factory, route: '/processor' },
    { id: 'qr_packaging', title: 'QR Bottling & Packaging', subtitle: 'Generate consumer QR codes', icon: QrCode, route: '/packaging/qr' },
    { id: 'register_harvest', title: 'Record Batch Intake', subtitle: 'Register incoming honey harvest', icon: Box, route: '/farms/add' },
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
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.header}>
                <Text style={styles.title}>{isCustomer ? 'Customer Actions' : 'Create'}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.list}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.listItem}
                      onPress={() => handlePress(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                        <Icon size={24} color={theme.colors.charcoal} strokeWidth={1.5} />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
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
