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
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderDark,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
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
