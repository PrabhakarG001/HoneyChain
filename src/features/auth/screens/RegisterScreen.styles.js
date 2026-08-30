import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 60,
  },
  header: {
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: 18,
  },
  errorBox: {
    backgroundColor: theme.colors.status.errorLight,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.status.error,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: theme.spacing.md,
  },
  roleButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.borderDark,
  },
  roleButtonActive: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryLight,
  },
  roleText: {
    fontWeight: 'bold',
    color: theme.colors.text.muted,
  },
  roleTextActive: {
    color: theme.colors.primaryDark,
  },
  submitContainer: {
    marginTop: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: theme.colors.text.secondary,
  },
  footerLink: {
    color: theme.colors.primaryDark,
    fontWeight: 'bold',
  }
});
