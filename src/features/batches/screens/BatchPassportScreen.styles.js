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
  header: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderDark,
    borderStyle: 'dashed',
    marginBottom: theme.spacing.md,
  },
  batchId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    marginTop: theme.spacing.sm,
  },
  statusText: {
    color: theme.colors.primaryDark,
    fontWeight: 'bold',
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    color: theme.colors.charcoal,
    fontWeight: '600',
  },
  timelineContainer: {
    marginTop: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  timelineLine: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  timelineDotInactive: {
    backgroundColor: theme.colors.borderDark,
  },
  timelineVertical: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.borderDark,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: theme.spacing.sm,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  timelineTitleInactive: {
    color: theme.colors.text.muted,
  },
  timelineDate: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  viewBlockchainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.charcoal,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginTop: theme.spacing.sm,
    marginBottom: 40,
  },
  viewBlockchainText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});
