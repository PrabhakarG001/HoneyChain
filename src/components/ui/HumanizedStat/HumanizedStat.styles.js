import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
    paddingRight: theme.spacing.md,
  },
  iconContainer: {
    marginTop: 2,
    marginRight: theme.spacing.md,
    opacity: 0.9,
  },
  textContainer: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    ...theme.typography.h2,
    fontWeight: '600',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
});
