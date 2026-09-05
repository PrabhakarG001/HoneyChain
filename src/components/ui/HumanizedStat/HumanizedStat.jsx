import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function HumanizedStat({ icon: Icon, color, value, description, badgeText }) {
  const colors = useThemeColors();
  const accentColor = color || (colors.isDark ? '#F4B942' : '#D97706');

  return (
    <View style={[
      styles.cardContainer,
      { 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        shadowColor: colors.isDark ? '#000000' : '#0F172A',
      }
    ]}>
      <View style={styles.topRow}>
        {Icon && (
          <View style={[styles.iconBadge, { backgroundColor: `${accentColor}18` }]}>
            <Icon size={20} color={accentColor} strokeWidth={2.2} />
          </View>
        )}
        {badgeText && (
          <View style={[styles.pillBadge, { backgroundColor: `${accentColor}20` }]}>
            <Text style={[styles.pillBadgeText, { color: accentColor }]}>{badgeText}</Text>
          </View>
        )}
      </View>

      <View style={styles.metricContent}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    justifyContent: 'space-between',
    minHeight: 112,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricContent: {
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
