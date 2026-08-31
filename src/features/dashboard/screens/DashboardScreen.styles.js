import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white, // Clean white surface like Pinterest
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  logoContainer: {
    marginRight: 12,
  },
  logoText: {
    ...theme.typography.h3,
    color: theme.colors.primary, // Brand color
    fontWeight: '800',
  },
  searchBarFake: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  searchPlaceholder: {
    color: theme.colors.text.secondary,
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
  },
  categoriesScroll: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
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

