import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.charcoal,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.borderDark,
  },
  
  // Sizes
  sm: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
  },
  lg: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  
  // Text Styles
  text: {
    fontWeight: 'bold',
  },
  text_primary: {
    color: '#000000',
  },
  text_secondary: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: theme.colors.primaryDark,
  },
  
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  }
});
