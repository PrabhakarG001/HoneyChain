import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { ShieldCheck, AlertTriangle, Package, FlaskConical, Bell } from 'lucide-react-native';
import { customerService } from '../../../services/customer.service';
import { batchService } from '../../../services/batch.service';
import { useThemeColors } from '../../../hooks/useThemeColors';
import TopHeader from '../../../components/navigation/TopHeader';
import styles from './ActivityScreen.styles';

export default function ActivityScreen() {
  const colors = useThemeColors();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const orders = await customerService.getOrders();
      const batches = await batchService.getBatches();

      const orderItems = (orders || []).map(o => ({
        id: `ord_${o.order_id}`,
        icon: Package,
        color: colors.accent,
        title: `Order ${o.status || 'Updated'}`,
        subtitle: `${o.product_name} • ${o.order_id}`,
        timestamp: o.date || 'Recent'
      }));

      const batchItems = (batches || []).slice(0, 5).map(b => ({
        id: `btch_${b.id}`,
        icon: b.status === 'PACKAGED' ? ShieldCheck : FlaskConical,
        color: colors.status.success,
        title: `Batch ${b.status || 'Recorded'}`,
        subtitle: `${b.batch_code} • ${b.id}`,
        timestamp: new Date(b.created_at || Date.now()).toLocaleDateString()
      }));

      const liveActivities = [...orderItems, ...batchItems];

      if (liveActivities.length > 0) {
        setActivities([
          { id: 'group_today', date: 'Recent Activity', items: liveActivities }
        ]);
      } else {
        setActivities([
          {
            id: 'group_default',
            date: 'System Activity',
            items: [
              { id: 'a1', icon: ShieldCheck, color: colors.status.success, title: 'Batch Verified', subtitle: 'HC-UP-2026-000123' },
              { id: 'a2', icon: AlertTriangle, color: colors.status.warning, title: 'Telemetry Inspection Active', subtitle: 'Smart Hive Telemetry' },
              { id: 'a3', icon: FlaskConical, color: colors.accent, title: 'Lab Result Authenticated', subtitle: 'Wild Forest Honey' },
            ]
          }
        ]);
      }
    } catch (err) {
      setActivities([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopHeader />
      
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Notifications & Activity</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          activities.map(group => (
            <View key={group.id} style={styles.group}>
              <Text style={[styles.dateLabel, { color: colors.subtext }]}>{group.date}</Text>
              
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <View key={item.id} style={[styles.activityCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color + '22' }]}>
                      <Icon size={24} color={item.color} />
                    </View>
                    <View style={styles.contentContainer}>
                      <Text style={[styles.activityTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.activitySubtitle, { color: colors.subtext }]}>{item.subtitle}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
