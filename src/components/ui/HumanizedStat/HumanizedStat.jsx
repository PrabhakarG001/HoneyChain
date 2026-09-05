import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function HumanizedStat({ icon: Icon, color, value, description, badgeText }) {
  const colors = useThemeColors();
  const accentColor = color || (colors.isDark ? '#F4B942' : '#D97706');

  return (
    <View style={[
      styles.metricBlock,
      { 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
      }
    ]}>
      <View style={styles.headerRow}>
        <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={1}>
          {description}
        </Text>
        {Icon && <Icon size={16} color={accentColor} strokeWidth={2} />}
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: colors.isDark ? '#1E293B' : '#F1F5F9' }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{badgeText}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricBlock: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    marginRight: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
