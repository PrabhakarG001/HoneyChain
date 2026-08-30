import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  containerSelected: {
    backgroundColor: theme.colors.charcoal,
    borderColor: theme.colors.charcoal,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  labelSelected: {
    color: theme.colors.white,
  },
});
