import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  activityRow: {
    flexDirection: 'row',
  },
  timeColumn: {
    width: 50,
    alignItems: 'flex-end',
    paddingTop: 2,
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  timelineColumn: {
    width: 30,
    alignItems: 'center',
  },
  dot: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: theme.colors.background,
  },
  line: {
    position: 'absolute',
    top: 20,
    bottom: -4, // extend to the next row
    width: 2,
    backgroundColor: theme.colors.border,
    zIndex: 1,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
    paddingTop: 1,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.charcoal,
    marginBottom: 4,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  }
});
