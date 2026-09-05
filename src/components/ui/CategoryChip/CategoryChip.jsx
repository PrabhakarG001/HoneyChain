import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import styles from './CategoryChip.styles';

export default function CategoryChip({ label, isSelected, onPress }) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? colors.text : colors.surface,
          borderColor: isSelected ? colors.text : colors.border
        }
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={label}
    >
      <Text style={[
        styles.label,
        { color: isSelected ? colors.background : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
