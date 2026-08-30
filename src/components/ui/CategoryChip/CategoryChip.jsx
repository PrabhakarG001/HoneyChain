import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './CategoryChip.styles';

export default function CategoryChip({ label, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
