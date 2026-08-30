import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  group: {
    marginBottom: theme.spacing.lg,
  },
  dateLabel: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  activityTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  activitySubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  }
});
