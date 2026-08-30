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
  hiveHeader: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  hiveId: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.md,
  },
  statusBadgeGood: {
    backgroundColor: theme.colors.status.successLight,
  },
  statusBadgeWarning: {
    backgroundColor: theme.colors.status.warningLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTextGood: {
    color: theme.colors.status.success,
  },
  statusTextWarning: {
    color: theme.colors.status.warning,
  },
  beeSpecies: {
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    marginBottom: theme.spacing.md,
  },
  iotCard: {
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: theme.radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  deviceIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceId: {
    color: theme.colors.charcoal,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.status.success,
  },
  sensorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorBlock: {
    alignItems: 'center',
    width: '33%',
  },
  sensorBlockBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  },
  sensorIconContainer: {
    marginBottom: 8,
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  sensorLabel: {
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  emptyIotCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIotText: {
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.md,
  },
  assignButton: {
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  assignButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
  }
});
