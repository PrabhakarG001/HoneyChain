import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    height: '100%',
  },
  clearButton: {
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
  },
});
