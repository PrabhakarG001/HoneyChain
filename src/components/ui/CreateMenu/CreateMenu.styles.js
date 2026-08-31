import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 48, // Extra padding for safe area
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.charcoal,
  },
  closeButton: {
    padding: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.full,
  },
  list: {
    flexDirection: 'column',
    marginTop: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    ...theme.typography.subtitle,
    fontWeight: '600',
    color: theme.colors.charcoal,
    marginBottom: 2,
  },
  itemSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  }
});
