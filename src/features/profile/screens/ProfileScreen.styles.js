import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  flex1: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  bio: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  statNumber: {
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  tabsContainer: {
    marginBottom: theme.spacing.lg,
  },
  tabsScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  tabWrapper: {
    marginRight: theme.spacing.sm,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  }
});

