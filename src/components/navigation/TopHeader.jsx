import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Search, X, Plus, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useThemeColors } from '../../hooks/useThemeColors';
import BrandLogo from '../ui/BrandLogo/BrandLogo';
import UserAvatar from '../ui/UserAvatar/UserAvatar';
import ProfileDropdown from '../profile/ProfileDropdown';
import EditProfileModal from '../profile/EditProfileModal';
import LogoutConfirmModal from '../profile/LogoutConfirmModal';
import CreateMenu from '../ui/CreateMenu/CreateMenu';

const SEARCH_SUGGESTIONS = [
  'Acacia Honey',
  'Organic Beekeeper Farms',
  'Hive Temperature Sensor',
  'Blockchain Passport Verification',
  'Wildflower Honey Batches',
  'Varroa Mite AI Scan'
];

export default function TopHeader({ onSearchQueryChange }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const colors = useThemeColors();

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isCreateMenuVisible, setIsCreateMenuVisible] = useState(false);

  const filteredSuggestions = query.trim()
    ? SEARCH_SUGGESTIONS.filter(item => item.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSearchSubmit = (textToSearch) => {
    const targetQuery = textToSearch !== undefined ? textToSearch : query;
    setIsFocused(false);
    if (onSearchQueryChange) {
      onSearchQueryChange(targetQuery);
    }
    router.push({
      pathname: '/(app)/(tabs)/explore',
      params: { q: targetQuery }
    });
  };

  const handleClear = () => {
    setQuery('');
    if (onSearchQueryChange) {
      onSearchQueryChange('');
    }
  };

  return (
    <>
      <View style={[styles.headerContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {/* Brand Logo "Honeychain" */}
        <TouchableOpacity onPress={() => router.push('/(app)/(tabs)')} activeOpacity={0.8}>
          <BrandLogo />
        </TouchableOpacity>

        {/* Pinterest Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchPill, 
            { backgroundColor: colors.surface },
            isFocused && { borderColor: colors.accent, backgroundColor: colors.background }
          ]}>
            <Search size={18} color={colors.subtext} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search Honeychain"
              placeholderTextColor={colors.subtext}
              value={query}
              onChangeText={(txt) => {
                setQuery(txt);
                if (onSearchQueryChange) onSearchQueryChange(txt);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
              onSubmitEditing={() => handleSearchSubmit()}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <X size={16} color={colors.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions Popover */}
          {isFocused && filteredSuggestions.length > 0 && (
            <View style={[styles.suggestionsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {filteredSuggestions.map((suggestion, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestionRow}
                    onPress={() => {
                      setQuery(suggestion);
                      handleSearchSubmit(suggestion);
                    }}
                  >
                    <Search size={14} color={colors.subtext} />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Right Actions: Plus (+) Button, Chat & Avatar */}
        <View style={styles.rightActions}>
          {(user?.role || '').toUpperCase() !== 'CUSTOMER' && (
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.surface }]}
              onPress={() => setIsCreateMenuVisible(true)}
            >
              <Plus size={20} color={colors.text} strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          {(user?.role || '').toUpperCase() !== 'CUSTOMER' && (
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(app)/(tabs)/notifications')}
            >
              <MessageSquare size={20} color={colors.text} />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => setIsDropdownVisible(true)}
            activeOpacity={0.8}
            style={[styles.avatarWrapper, { borderColor: colors.accent }]}
          >
            <UserAvatar user={user} size={32} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <CreateMenu
        isVisible={isCreateMenuVisible}
        onClose={() => setIsCreateMenuVisible(false)}
      />

      <ProfileDropdown
        isVisible={isDropdownVisible}
        onClose={() => setIsDropdownVisible(false)}
        onOpenEditProfile={() => setIsEditProfileVisible(true)}
        onOpenLogout={() => setIsLogoutVisible(true)}
      />

      <EditProfileModal
        isVisible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
      />

      <LogoutConfirmModal
        isVisible={isLogoutVisible}
        onClose={() => setIsLogoutVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 100,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 40,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderRadius: 16,
    paddingVertical: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    zIndex: 200,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  suggestionText: {
    fontSize: 14,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: 18,
    borderWidth: 2,
  },
});
