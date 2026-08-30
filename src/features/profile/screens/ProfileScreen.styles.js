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
    paddingBottom: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.md,
  },
  profileText: {
    flex: 1,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  role: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  }
});
