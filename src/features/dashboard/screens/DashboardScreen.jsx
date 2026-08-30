import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, LayoutDashboard, Plus, Leaf, Hexagon } from 'lucide-react-native';
import { useAuthStore } from '../../../store/auth.store';
import { USER_ROLES } from '../../../constants/roles';
import { theme } from '../../../theme';
import styles from './DashboardScreen.styles';

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const BeekeeperDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCardHalf}>
          <Leaf color={theme.colors.primaryDark} size={32} style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>My Farms</Text>
        </View>
        <View style={styles.statCardHalf}>
          <Hexagon color={theme.colors.primaryDark} size={32} style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Active Hives</Text>
        </View>
        <View style={styles.statCardFull}>
          <Text style={styles.statValueHighlight}>0</Text>
          <Text style={styles.statLabel}>Honey Batches</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push('/(app)/farms')}
      >
        <View style={styles.actionIconContainer}>
          <Plus color={theme.colors.white} size={20} />
        </View>
        <Text style={styles.actionText}>Add Farm</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {}} 
      >
        <View style={styles.actionIconContainer}>
          <Plus color={theme.colors.white} size={20} />
        </View>
        <Text style={styles.actionText}>Add Hive</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, styles.actionButtonDark]}
        onPress={() => {}} 
      >
        <View style={[styles.actionIconContainer, styles.actionIconContainerDark]}>
          <Plus color={theme.colors.white} size={20} />
        </View>
        <Text style={[styles.actionText, styles.actionTextDark]}>Create Batch</Text>
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.emptyStateBox}>
        <Text style={styles.emptyStateText}>No recent activity</Text>
      </View>
    </View>
  );

  const CustomerDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.customerCard}>
        <View style={styles.customerIconBg}>
          <LayoutDashboard color={theme.colors.primary} size={64} />
        </View>
        <Text style={styles.customerTitle}>Discover the journey behind your honey.</Text>
        <Text style={styles.customerSubtitle}>Scan the QR code on your product to verify its authenticity and origin.</Text>
        
        <TouchableOpacity style={styles.scanButton} onPress={() => {}}>
          <Text style={styles.scanButtonText}>Scan Honey QR</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Recently Verified</Text>
      <View style={styles.emptyStateBox}>
        <Text style={styles.emptyStateText}>No verified products yet</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut color={theme.colors.status.error} size={20} />
        </TouchableOpacity>
      </View>

      {user?.role === USER_ROLES.BEEKEEPER ? <BeekeeperDashboard /> : <CustomerDashboard />}
      
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}
