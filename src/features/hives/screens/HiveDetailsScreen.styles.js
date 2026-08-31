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
  heroContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    position: 'absolute',
    left: theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 20,
  },
  headerContent: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  hiveId: {
    ...theme.typography.h1,
    color: theme.colors.charcoal,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeGood: {
    backgroundColor: theme.colors.status.successLight,
  },
  statusBadgeWarning: {
    backgroundColor: theme.colors.status.warningLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotGood: {
    backgroundColor: theme.colors.status.success,
  },
  statusDotWarning: {
    backgroundColor: theme.colors.status.warning,
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.charcoal,
  },
  beeSpecies: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  section: {
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.charcoal,
    marginBottom: theme.spacing.lg,
  },
  dataContainer: {
    paddingTop: theme.spacing.sm,
  },
  deviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  deviceText: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginLeft: 6,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  assignButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  assignButtonText: {
    ...theme.typography.subtitle,
    color: theme.colors.white,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.charcoal,
  },
  activityTime: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  }
});
