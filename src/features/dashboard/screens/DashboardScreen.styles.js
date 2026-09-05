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
  searchBarButton: {
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
  heroBanner: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  activitySection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  feedHeader: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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


