import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  farmHeader: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  farmName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  location: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: theme.colors.text.muted,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontWeight: '600',
    color: theme.colors.charcoal,
  },
  listHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  addHiveButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addHiveText: {
    color: '#78350f', // honey-900
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  hiveCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  hiveId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  hiveStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiveStatusLabel: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  hiveStatusValue: {
    fontWeight: 'semibold',
    color: theme.colors.status.success,
  },
  sensorsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  sensorItem: {
    alignItems: 'center',
  },
  sensorValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    marginTop: 4,
  }
});
