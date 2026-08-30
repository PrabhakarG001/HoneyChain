import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 60,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.primaryDark,
    fontWeight: '500',
    letterSpacing: 1,
  },
  footer: {
    color: theme.colors.text.muted,
    fontSize: 12,
    marginTop: theme.spacing.xl,
  }
});
