import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.primaryDark,
    marginLeft: 8,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insight: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 24,
    fontSize: 15,
  }
});
