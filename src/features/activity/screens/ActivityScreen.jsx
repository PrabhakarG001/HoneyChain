import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { ShieldCheck, AlertTriangle, Package, FlaskConical } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './ActivityScreen.styles';

const ACTIVITY_DATA = [
  { id: '1', date: 'Today', items: [
    { id: 'a1', icon: ShieldCheck, color: theme.colors.status.success, title: 'Batch Verified', subtitle: 'HC-UP-2026-000123' },
    { id: 'a2', icon: AlertTriangle, color: theme.colors.status.warning, title: 'Temperature Alert', subtitle: 'Hive HV-UP-00123' },
    { id: 'a3', icon: FlaskConical, color: theme.colors.status.info, title: 'Lab Result Available', subtitle: 'Wild Forest Honey' },
  ]},
  { id: '2', date: 'Yesterday', items: [
    { id: 'a4', icon: Package, color: theme.colors.primaryDark, title: 'Shipment Delivered', subtitle: 'Order #8892' },
  ]},
];

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {ACTIVITY_DATA.map(group => (
          <View key={group.id} style={styles.group}>
            <Text style={styles.dateLabel}>{group.date}</Text>
            
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={styles.activityCard}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Icon size={24} color={item.color} />
                  </View>
                  <View style={styles.contentContainer}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
