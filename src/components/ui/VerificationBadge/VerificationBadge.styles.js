import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  blockchain: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  ai: {
    backgroundColor: theme.colors.primaryLight,
  },
  text: {
    ...theme.typography.caption,
    fontWeight: '700',
    marginLeft: 4,
  },
  textBlockchain: {
    color: theme.colors.status.info,
  },
  textAi: {
    color: theme.colors.primaryDark,
  },
});
