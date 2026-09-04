import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Search, X, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/auth.store';
import BrandLogo from '../ui/BrandLogo/BrandLogo';
import UserAvatar from '../ui/UserAvatar/UserAvatar';
import ProfileDropdown from '../profile/ProfileDropdown';
import EditProfileModal from '../profile/EditProfileModal';
import LogoutConfirmModal from '../profile/LogoutConfirmModal';

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

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

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
      <View style={styles.headerContainer}>
        {/* Brand Logo */}
        <TouchableOpacity onPress={() => router.push('/(app)/(tabs)')} activeOpacity={0.8}>
          <BrandLogo />
        </TouchableOpacity>

        {/* Pinterest Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchPill, isFocused && styles.searchPillFocused]}>
            <Search size={18} color={theme.colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search HoneyChain (hives, honey, farms...)"
              placeholderTextColor={theme.colors.text.muted}
              value={query}
              onChangeText={(txt) => {
                setQuery(txt);
                if (onSearchQueryChange) onSearchQueryChange(txt);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Short delay to allow clicking suggestions
                setTimeout(() => setIsFocused(false), 200);
              }}
              onSubmitEditing={() => handleSearchSubmit()}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <X size={16} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions Popover */}
          {isFocused && filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
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
                    <Search size={14} color={theme.colors.text.muted} />
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Right Actions: Notifications & User Avatar */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push('/(app)/(tabs)/notifications')}
          >
            <Bell size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setIsDropdownVisible(true)}
            activeOpacity={0.8}
            style={styles.avatarWrapper}
          >
            <UserAvatar user={user} size={36} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Popovers & Modals */}
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
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    backgroundColor: theme.colors.background.main,
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  searchPillFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    paddingVertical: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text.primary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background.main,
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
});
