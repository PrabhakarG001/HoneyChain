import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { theme } from '../../../theme';

export function calculatePasswordStrength(password = '') {
  if (!password) return { score: 0, label: '', color: '#E0E0E0' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length >= 12 && score >= 3) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', color: theme.colors.status.error };
    case 2:
      return { score: 2, label: 'Fair', color: theme.colors.status.warning };
    case 3:
      return { score: 3, label: 'Good', color: '#D97706' };
    case 4:
      return { score: 4, label: 'Strong', color: theme.colors.status.success };
    case 5:
      return { score: 5, label: 'Excellent 🛡️', color: '#059669' };
    default:
      return { score: 0, label: 'Too Weak', color: theme.colors.status.error };
  }
}

export default function PasswordStrengthIndicator({ password = '' }) {
  if (!password) return null;

  const { score, label, color } = calculatePasswordStrength(password);

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a number (0-9)', met: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <View style={styles.container}>
      {/* Strength Header */}
      <View style={styles.header}>
        <Text style={styles.labelTitle}>Password Strength:</Text>
        <Text style={[styles.labelStatus, { color }]}>{label}</Text>
      </View>

      {/* Strength Bar */}
      <View style={styles.barContainer}>
        {[1, 2, 3, 4].map((step) => {
          const isActive = score >= step;
          return (
            <View
              key={step}
              style={[
                styles.barSegment,
                { backgroundColor: isActive ? color : theme.colors.border }
              ]}
            />
          );
        })}
      </View>

      {/* Checklist */}
      <View style={styles.checklist}>
        {checks.map((item, index) => (
          <View key={index} style={styles.checkItem}>
            {item.met ? (
              <Check size={14} color={theme.colors.status.success} style={styles.checkIcon} />
            ) : (
              <X size={14} color={theme.colors.text.muted} style={styles.checkIcon} />
            )}
            <Text
              style={[
                styles.checkText,
                item.met && styles.checkTextMet
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  labelTitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  labelStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
    gap: 4,
  },
  barSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 2,
  },
  checklist: {
    marginTop: 4,
    gap: 2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 6,
  },
  checkText: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  checkTextMet: {
    color: theme.colors.charcoal,
    fontWeight: '600',
  }
});
