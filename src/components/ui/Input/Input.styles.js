import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.charcoal,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: theme.colors.status.error,
    backgroundColor: theme.colors.status.errorLight,
  },
  input: {
    color: theme.colors.charcoal,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  }
});
