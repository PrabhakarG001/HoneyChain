import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  trackContainer: {
    position: 'relative',
    height: 80,
    justifyContent: 'center',
  },
  trackBackground: {
    position: 'absolute',
    top: 24,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: theme.colors.border,
    zIndex: 1,
  },
  trackActive: {
    position: 'absolute',
    top: 24,
    left: 20,
    height: 2,
    backgroundColor: theme.colors.primary,
    zIndex: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 3,
    minWidth: 400,
  },
  stepContainer: {
    alignItems: 'center',
    width: 70,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
  },
  iconWrapperCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  iconWrapperCurrent: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapperPending: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  label: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  labelCompleted: {
    color: theme.colors.charcoal,
    fontWeight: '600',
  },
  labelPending: {
    color: theme.colors.text.muted,
  },
});
