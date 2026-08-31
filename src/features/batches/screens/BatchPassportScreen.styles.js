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
  heroImageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.border,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  headerActions: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: theme.radius.full,
  },
  headerContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    marginTop: -32,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  certificateTitle: {
    ...theme.typography.caption,
    textAlign: 'center',
    color: theme.colors.primaryDark,
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  verificationRow: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.charcoal,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  batchId: {
    ...theme.typography.subtitle,
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.charcoal,
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.charcoal,
  },
  timelineContainer: {
    paddingTop: theme.spacing.sm,
  },
  blockchainContainer: {
    paddingTop: theme.spacing.sm,
  },
  blockchainTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.status.success,
    marginBottom: theme.spacing.xs,
  },
  blockchainDesc: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  blockchainHash: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    fontFamily: 'monospace',
    backgroundColor: theme.colors.white,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }
});

