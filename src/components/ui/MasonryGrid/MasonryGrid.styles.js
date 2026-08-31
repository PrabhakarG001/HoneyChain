import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    width: '100%',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  itemContainer: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
});
