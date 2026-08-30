import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 60,
    flexDirection: 'row',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    fontWeight: '700',
    marginTop: 2,
  },
  scanIconContainer: {
    borderRadius: theme.radius.full,
    padding: 4,
    overflow: 'hidden',
  }
});
