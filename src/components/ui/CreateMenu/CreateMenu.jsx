import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, PlusCircle, Image as ImageIcon, FileText, QrCode, ScanLine, X } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './CreateMenu.styles';

const MENU_ITEMS = [
  { id: 'add_hive', title: 'Add a Hive', subtitle: 'Track a new hive in your apiary', icon: PlusCircle, route: '/hives/add' },
  { id: 'record_harvest', title: 'Record Harvest', subtitle: 'Log a new honey extraction', icon: Box, route: '/farms/add' },
  { id: 'add_batch', title: 'Create Honey Passport', subtitle: 'Mint a new verified batch', icon: QrCode, route: '/batches/create' },
];

export default function CreateMenu({ isVisible, onClose }) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
                <Text style={styles.title}>Create</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.list}>
                {MENU_ITEMS.map((item) => {
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
