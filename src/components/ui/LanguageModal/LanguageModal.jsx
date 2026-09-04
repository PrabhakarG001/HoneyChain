import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, 
  TextInput, FlatList, TouchableWithoutFeedback, Dimensions 
} from 'react-native';
import { Search, X, CheckCircle2, Globe } from 'lucide-react-native';
import { INDIAN_LANGUAGES } from '../../../constants/languages';
import { useTranslation } from '../../../hooks/useTranslation';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function LanguageModal({ isVisible, onClose }) {
  const colors = useThemeColors();
  const { t, languageCode, setLanguageCode } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isVisible) return null;

  const filteredLanguages = INDIAN_LANGUAGES.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(query) ||
      item.native.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query)
    );
  });

  const handleSelectLanguage = (code) => {
    setLanguageCode(code);
    setSearchQuery('');
    if (onClose) onClose();
  };

  return (
    <Modal 
      visible={isVisible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              
              {/* Modal Header */}
              <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
                <View style={styles.headerTitleRow}>
                  <Globe size={20} color={colors.accent} />
                  <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {t('selectLanguage', 'Select Language / भाषा चुनें')}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={onClose} 
                  style={[styles.iconCloseBtn, { backgroundColor: colors.surface }]}
                  accessibilityRole="button"
                  accessibilityLabel="Close language selector"
                >
                  <X size={18} color={colors.subtext} />
                </TouchableOpacity>
              </View>

              {/* Search Box */}
              <View style={styles.searchWrapper}>
                <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Search size={18} color={colors.subtext} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder={t('searchLanguage', 'Search language (e.g. Hindi, தமிழ்)...')}
                    placeholderTextColor={colors.subtext}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <X size={16} color={colors.subtext} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Language List */}
              <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item.code}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                  <View style={styles.emptyBox}>
                    <Globe size={32} color={colors.subtext} style={{ marginBottom: 8 }} />
                    <Text style={[styles.emptyText, { color: colors.subtext }]}>
                      {t('noLanguageFound', 'No matching language found')}
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => {
                  const isSelected = languageCode === item.code;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.languageItem,
                        { 
                          backgroundColor: isSelected ? (colors.isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7') : colors.surface, 
                          borderColor: isSelected ? colors.accent : colors.border 
                        }
                      ]}
                      onPress={() => handleSelectLanguage(item.code)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${item.name} language`}
                    >
                      <View style={styles.langNameGroup}>
                        <Text style={[styles.nativeName, { color: colors.text }]}>
                          {item.native}
                        </Text>
                        {item.name !== item.native && (
                          <Text style={[styles.englishName, { color: colors.subtext }]}>
                            {item.name}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <CheckCircle2 size={20} color={colors.accent} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    maxHeight: Dimensions.get('window').height * 0.8,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  iconCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  langNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '700',
  },
  englishName: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
