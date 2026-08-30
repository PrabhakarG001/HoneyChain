import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.white,
  },
  containerLarge: {
    borderWidth: 4,
    borderRadius: theme.radius.full,
    width: 120,
    height: 120,
    alignSelf: 'center',
    shadowColor: theme.shadows.md.shadowColor,
    shadowOffset: theme.shadows.md.shadowOffset,
    shadowOpacity: theme.shadows.md.shadowOpacity,
    shadowRadius: theme.shadows.md.shadowRadius,
    elevation: theme.shadows.md.elevation,
  },
  score: {
    ...theme.typography.subtitle,
    fontWeight: '800',
  },
  scoreLarge: {
    fontSize: 48,
    lineHeight: 56,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: -4,
  }
});
