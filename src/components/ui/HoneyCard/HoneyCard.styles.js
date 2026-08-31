import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'visible',
    marginBottom: theme.spacing.lg,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: theme.colors.border, 
    borderRadius: 16, // softer radius
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    paddingTop: theme.spacing.sm,
    paddingHorizontal: 2,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
  textBadge: {
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  textBadgeLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  verifiedBadgeContainer: {
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-start',
  }
});

