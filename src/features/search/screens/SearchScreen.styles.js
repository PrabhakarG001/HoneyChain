import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  recentContainer: {
    gap: theme.spacing.sm,
  },
  recentItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentText: {
    ...theme.typography.subtitle,
    color: theme.colors.text.secondary,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
  },
  chipWrapper: {
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  }
});
