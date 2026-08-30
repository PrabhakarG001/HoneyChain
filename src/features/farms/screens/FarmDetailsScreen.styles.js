import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.border,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginTop: -32,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  farmName: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  location: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  metricsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  addButtonText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  }
});
