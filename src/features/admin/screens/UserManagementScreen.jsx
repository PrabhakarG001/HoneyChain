import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Users, ArrowLeft, Search, ShieldCheck, UserCheck, ChevronDown, Check } from 'lucide-react-native';
import { firestoreService } from '../../../services/firestore.service';
import { auditService } from '../../../services/audit.service';
import { USER_ROLES } from '../../../constants/roles';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function UserManagementScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const DEFAULT_USERS = [
    { uid: 'USR_001', displayName: 'Prabhakar Beekeeper', email: 'beekeeper@honeychain.io', role: 'BEEKEEPER', createdAt: '2026-01-15' },
    { uid: 'USR_002', displayName: 'Dr. Evelyn Vance', email: 'lab@honeychain.io', role: 'LAB', createdAt: '2026-02-01' },
    { uid: 'USR_003', displayName: 'Apex Honey Processors', email: 'processor@honeychain.io', role: 'PROCESSOR', createdAt: '2026-02-10' },
    { uid: 'USR_004', displayName: 'Alice Consumer', email: 'alice@gmail.com', role: 'CUSTOMER', createdAt: '2026-03-01' },
    { uid: 'USR_005', displayName: 'System Administrator', email: 'admin@honeychain.io', role: 'ADMIN', createdAt: '2026-01-01' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetched = await firestoreService.getUsers();
      if (fetched && fetched.length > 0) {
        setUsers(fetched);
      } else {
        setUsers(DEFAULT_USERS);
      }
    } catch (e) {
      setUsers(DEFAULT_USERS);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    try {
      await firestoreService.updateUserRole(uid, newRole);
      await auditService.logAction('USER_ROLE_UPDATED', { uid, newRole });

      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );

      setSelectedUser(null);
      Alert.alert('Role Updated', `User role updated to ${newRole}.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update user role.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = u.displayName || u.email || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User & RBAC Management</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search users by name, email or role..."
            placeholderTextColor={colors.subtext}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.text }]}>Ecosystem User Accounts ({filteredUsers.length})</Text>

        {loading ? (
          <ActivityIndicator color="#7C3AED" size="large" style={{ marginVertical: 40 }} />
        ) : (
          filteredUsers.map((user) => (
            <View key={user.uid} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.userRow}>
                <View style={[styles.avatar, { backgroundColor: colors.isDark ? '#3B0764' : '#F3E8FF' }]}>
                  <Text style={[styles.avatarText, { color: colors.isDark ? '#C084FC' : '#7C3AED' }]}>
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.displayName || 'HoneyChain User'}</Text>
                  <Text style={[styles.userEmail, { color: colors.subtext }]}>{user.email}</Text>
                </View>
                <View style={[styles.roleTag, { backgroundColor: colors.isDark ? '#3B0764' : '#F3E8FF' }]}>
                  <Text style={[styles.roleTagText, { color: colors.isDark ? '#C084FC' : '#7C3AED' }]}>{user.role || 'CUSTOMER'}</Text>
                </View>
              </View>

              {/* Expand Role Selector */}
              <TouchableOpacity
                style={[styles.changeRoleBtn, { backgroundColor: colors.background }]}
                onPress={() => setSelectedUser(selectedUser === user.uid ? null : user.uid)}
              >
                <Text style={styles.changeRoleBtnText}>Change Access Role</Text>
                <ChevronDown size={16} color="#7C3AED" />
              </TouchableOpacity>

              {selectedUser === user.uid && (
                <View style={[styles.roleOptionsGrid, { borderTopColor: colors.border }]}>
                  {Object.keys(USER_ROLES).map((roleKey) => (
                    <TouchableOpacity
                      key={roleKey}
                      style={[
                        styles.roleOptionChip,
                        { backgroundColor: colors.isDark ? '#1E293B' : '#F1F5F9' },
                        user.role === roleKey && styles.roleOptionActive,
                      ]}
                      onPress={() => handleRoleChange(user.uid, roleKey)}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          { color: colors.text },
                          user.role === roleKey && styles.roleOptionTextActive,
                        ]}
                      >
                        {roleKey}
                      </Text>
                      {user.role === roleKey && <Check size={14} color="#FFFFFF" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  changeRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  changeRoleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  roleOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  roleOptionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  roleOptionActive: {
    backgroundColor: '#7C3AED',
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleOptionTextActive: {
    color: '#FFFFFF',
  },
});
