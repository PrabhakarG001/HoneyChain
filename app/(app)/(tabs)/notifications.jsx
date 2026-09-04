import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { AlertTriangle, Info, CheckCircle, Activity, Trash2, BellOff, X } from 'lucide-react-native';
import { useScrollToHideNav } from '../../../src/hooks/useScrollToHideNav';
import { useThemeColors } from '../../../src/hooks/useThemeColors';

const DEFAULT_NOTIFICATIONS = [
  { id: '1', type: 'attention', title: 'Hive #12 Temperature Alert', message: 'Internal hive temperature exceeded optimal threshold (37.2°C). Please check ventilation.', time: '10m ago', read: false },
  { id: '2', type: 'success', title: 'Quality Report Verified', message: 'Batch HC-UP-2026-000456 has passed all lab tests and is now verified on-chain.', time: '2h ago', read: true },
  { id: '3', type: 'info', title: 'Organic Certification Renewed', message: 'Your Sonoma Valley Apiary organic seal is active for the 2026 harvest season.', time: '1d ago', read: true },
  { id: '4', type: 'system', title: 'Weekly Harvest Yield', message: 'Your apiary registered 14% higher extraction volume compared to last week.', time: '2d ago', read: true },
];

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const { onScroll, scrollEventThrottle } = useScrollToHideNav();
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const getIcon = (type) => {
    switch (type) {
      case 'attention': return <AlertTriangle size={22} color={colors.status.error} />;
      case 'success': return <CheckCircle size={22} color={colors.status.success} />;
      case 'system': return <Activity size={22} color={colors.accent} />;
      default: return <Info size={22} color="#2563EB" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'attention': return colors.isDark ? '#371B1B' : '#FEF2F2';
      case 'success': return colors.isDark ? '#142E25' : '#ECFDF5';
      case 'system': return colors.isDark ? '#2E2211' : '#FEF3C7';
      default: return colors.isDark ? '#1E293B' : '#EFF6FF';
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setNotifications([]) }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.notificationCard, 
      { backgroundColor: colors.surface, borderColor: colors.border },
      !item.read && { borderColor: colors.accent }
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: getBgColor(item.type) }]}>
        {getIcon(item.type)}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }, !item.read && styles.unreadText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.time, { color: colors.subtext }]}>{item.time}</Text>
        </View>
        <Text style={[styles.message, { color: colors.subtext }]} numberOfLines={2}>{item.message}</Text>
      </View>

      {/* Individual Item Delete Button */}
      <TouchableOpacity 
        style={styles.deleteItemBtn}
        onPress={() => handleDeleteNotification(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={16} color={colors.subtext} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <Text style={[styles.headerSub, { color: colors.subtext }]}>
            {notifications.length} {notifications.length === 1 ? 'alert' : 'alerts'}
          </Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity 
            style={[styles.clearAllBtn, { backgroundColor: colors.isDark ? '#371B1B' : '#FEF2F2' }]} 
            onPress={handleClearAll}
          >
            <Trash2 size={16} color={colors.status.error} />
            <Text style={[styles.clearAllText, { color: colors.status.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List or Empty State */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
            <BellOff size={48} color={colors.subtext} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notifications</Text>
          <Text style={[styles.emptySub, { color: colors.subtext }]}>You have cleared all your HoneyChain alerts and updates.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: '800',
  },
  time: {
    fontSize: 11,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  deleteItemBtn: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
