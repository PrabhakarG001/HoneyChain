import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  logoContainer: {
    marginRight: 12,
  },
  logoText: {
    ...theme.typography.h3,
    color: theme.colors.primaryDark,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchBarFake: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchPlaceholder: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginLeft: 8,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.white,
  },
  greetingSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  greetingTitle: {
    ...theme.typography.h2,
    color: theme.colors.charcoal,
    marginBottom: 4,
  },
  greetingSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedHeader: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  feedTitle: {
    ...theme.typography.h3,
    color: theme.colors.charcoal,
  },
  categoriesScroll: {
    marginBottom: theme.spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  chipWrapper: {
    marginRight: theme.spacing.sm,
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm, 
  },
});


