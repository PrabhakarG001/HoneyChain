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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: theme.colors.border,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginTop: -40,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  badgeContainer: {
    marginVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batchIdLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  batchId: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  blockchainCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  blockchainTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.status.info,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  blockchainHash: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontFamily: 'monospace',
    marginTop: theme.spacing.xs,
  }
});
