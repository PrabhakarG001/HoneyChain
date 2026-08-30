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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subGreeting: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  logoutButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.full,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm, // Masonry grid has inner padding
  },
  // Beekeeper inline stats
  statsCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.primaryDark,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
});
