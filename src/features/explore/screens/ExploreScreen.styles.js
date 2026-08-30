import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  carousel: {
    paddingHorizontal: theme.spacing.md,
  },
  carouselItem: {
    width: 160,
    marginHorizontal: theme.spacing.xs,
  },
  carouselItemLarge: {
    width: 280,
    marginHorizontal: theme.spacing.xs,
  }
});
