import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../../../theme';
import styles from './HumanizedStat.styles';

export default function HumanizedStat({ icon: Icon, color, value, description }) {
  const iconColor = color || theme.colors.text.primary;
  
  return (
    <View style={styles.container}>
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon size={22} color={iconColor} strokeWidth={1.5} />
        </View>
      )}
      <View style={styles.textContainer}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: iconColor }]}>{value}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}
