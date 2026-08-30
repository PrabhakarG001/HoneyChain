import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: theme.spacing.md,
  },
  eventContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 11, // half of icon width (24/2) - 1
    top: 24,
    bottom: -theme.spacing.lg,
    width: 2,
    backgroundColor: theme.colors.borderDark,
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: theme.colors.status.success,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  title: {
    ...theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  textMuted: {
    color: theme.colors.text.muted,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  }
});
