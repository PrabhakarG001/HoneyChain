import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  blockchain: {
    backgroundColor: theme.colors.status.info + '10', // 10% opacity
    borderColor: theme.colors.status.info + '30',
  },
  ai: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary + '30',
  },
  text: {
    ...theme.typography.caption,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  textBlockchain: {
    color: theme.colors.status.info,
  },
  textAi: {
    color: theme.colors.primaryDark,
  },
});
