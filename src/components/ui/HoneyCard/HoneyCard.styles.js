import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: theme.colors.border, // placeholder color
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
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: theme.radius.full,
    padding: 6,
  },
  content: {
    padding: theme.spacing.sm,
  },
  title: {
    ...theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
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
  }
});
