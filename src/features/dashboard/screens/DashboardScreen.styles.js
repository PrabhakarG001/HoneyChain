import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  greeting: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  logoutButton: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderDark,
  },
  dashboardContainer: {
    marginTop: theme.spacing.lg,
  },
  
  // Beekeeper styles
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCardHalf: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    width: '48%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statCardFull: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    width: '100%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
  },
  statValueHighlight: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionButtonDark: {
    backgroundColor: theme.colors.charcoal,
  },
  actionIconContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.md,
  },
  actionIconContainerDark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actionText: {
    color: '#78350f', // honey-900
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionTextDark: {
    color: theme.colors.white,
  },
  emptyStateBox: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  emptyStateText: {
    color: theme.colors.text.muted,
  },
  
  // Customer styles
  customerCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerIconBg: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.lg,
  },
  customerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  customerSubtitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomSpacer: {
    height: 40,
  }
});
