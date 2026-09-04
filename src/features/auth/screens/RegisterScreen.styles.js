import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  desktopScrollContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  desktopContainer: {
    maxWidth: 1000,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing.xl,
  },

  /* Desktop Showcase Banner */
  showcaseSide: {
    flex: 1.1,
    backgroundColor: 'rgba(31, 26, 23, 0.95)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A322C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  showcaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(230, 167, 64, 0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(230, 167, 64, 0.3)',
    marginBottom: theme.spacing.lg,
  },
  showcaseBadgeText: {
    color: '#E6A740',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: theme.spacing.xs,
  },
  showcaseTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: theme.spacing.md,
  },
  showcaseSubtitle: {
    fontSize: 15,
    color: '#B0A9A1',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  featureList: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  featureIcon: {
    marginRight: theme.spacing.md,
  },
  featureTextGroup: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featureDesc: {
    fontSize: 12,
    color: '#B0A9A1',
    marginTop: 2,
  },
  showcaseFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: theme.spacing.md,
  },
  showcaseFooterText: {
    fontSize: 12,
    color: '#7A7265',
    fontWeight: '600',
  },

  /* Auth Card */
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#1F1A17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  desktopCard: {
    maxWidth: 480,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoStyle: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.charcoal,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    textAlign: 'center',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.status.errorLight,
    borderWidth: 1,
    borderColor: 'rgba(178, 90, 92, 0.3)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    flex: 1,
    color: theme.colors.status.error,
    fontSize: 13,
    fontWeight: '600',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.status.successLight,
    borderWidth: 1,
    borderColor: 'rgba(91, 123, 106, 0.3)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  successText: {
    flex: 1,
    color: theme.colors.status.success,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Role Selection */
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.charcoal,
    marginBottom: theme.spacing.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  roleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
  },
  roleCardActive: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: '#FFFDF5',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleEmoji: {
    fontSize: 22,
    marginRight: theme.spacing.xs,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.charcoal,
  },
  roleTitleActive: {
    color: theme.colors.primaryDark,
  },
  roleDesc: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },

  /* Terms Checkbox */
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: 4,
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
  termsLink: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  termsErrorText: {
    color: theme.colors.status.error,
    fontSize: 12,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },

  submitContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
    marginHorizontal: theme.spacing.sm,
  },
  googleBtn: {
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  googleBtnDisabled: {
    opacity: 0.6,
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
  }
});
