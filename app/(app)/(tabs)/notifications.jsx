import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../../src/theme';
import { AlertTriangle, Info, CheckCircle, Activity } from 'lucide-react-native';

const NOTIFICATIONS = [
  { id: '1', type: 'attention', title: 'Hive #12 Temperature Alert', message: 'Temperature has exceeded the optimal threshold. Please check the hive ventilation.', time: '10m ago', read: false },
  { id: '2', type: 'success', title: 'Quality Report Verified', message: 'Batch HC-UP-2026-000456 has passed all lab tests and is now verified.', time: '2h ago', read: true },
  { id: '3', type: 'info', title: 'New App Feature', message: 'You can now share your Honey Passports directly to Instagram stories!', time: '1d ago', read: true },
  { id: '4', type: 'system', title: 'Weekly Digest', message: 'Your apiary produced 14% more honey this week compared to last week.', time: '2d ago', read: true },
];

const getIcon = (type) => {
  switch(type) {
    case 'attention': return <AlertTriangle size={24} color={theme.colors.status.error} />;
    case 'success': return <CheckCircle size={24} color={theme.colors.status.success} />;
    case 'system': return <Activity size={24} color={theme.colors.primary} />;
    default: return <Info size={24} color={theme.colors.status.info} />;
  }
};

const getBgColor = (type) => {
  switch(type) {
    case 'attention': return theme.colors.status.errorLight;
    case 'success': return theme.colors.status.successLight;
    case 'system': return theme.colors.background;
    default: return theme.colors.status.infoLight;
  }
};

export default function NotificationsScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <View style={[styles.iconContainer, { backgroundColor: getBgColor(item.type) }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.charcoal,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.white,
  },
  unreadCard: {
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...theme.typography.subtitle,
    fontWeight: '600',
    color: theme.colors.charcoal,
    flex: 1,
  },
  unreadText: {
    fontWeight: '800',
  },
  time: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginLeft: 8,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  }
});

