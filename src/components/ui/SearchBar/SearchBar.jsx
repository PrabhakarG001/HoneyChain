import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './SearchBar.styles';

export default function SearchBar({ value, onChangeText, placeholder = 'Search...', onClear }) {
  return (
    <View style={styles.container}>
      <Search size={20} color={theme.colors.text.muted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.muted}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <X size={16} color={theme.colors.text.muted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
