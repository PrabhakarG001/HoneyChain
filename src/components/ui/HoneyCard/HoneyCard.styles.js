import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'visible',
    marginBottom: theme.spacing.md,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: theme.colors.background, // placeholder color
    borderRadius: 20, // Large radius for Pinterest style
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.status.success,
    borderRadius: theme.radius.full,
    padding: 4,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    paddingTop: theme.spacing.xs,
    paddingHorizontal: 4,
  },
  title: {
    ...theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
    fontSize: 13,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
  },
  textBadge: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  textBadgeLabel: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '600',
    fontSize: 10,
  },
  verifiedBadgeContainer: {
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-start',
  }
});

