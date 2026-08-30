import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoal,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.white,
    marginBottom: 8,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanFrame: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: theme.colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: theme.radius.xl,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: theme.radius.xl,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: theme.radius.xl,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: theme.radius.xl,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  scanButtonText: {
    ...theme.typography.subtitle,
    color: theme.colors.white,
  }
});
