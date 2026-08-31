import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Using gap for comfortable spacing
  },
  logoImage: {
    width: 28, // Appropriately sized for header context
    height: 28,
  },
  logoText: {
    ...theme.typography.h3,
    color: theme.colors.primaryDark,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
