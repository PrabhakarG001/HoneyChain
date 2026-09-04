import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.charcoal,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: '#FFFFFF',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: theme.colors.status.error,
    backgroundColor: theme.colors.status.errorLight,
  },
  leftIconContainer: {
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: theme.colors.charcoal,
    fontSize: 15,
    paddingVertical: 0,
    height: '100%',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  }
});

