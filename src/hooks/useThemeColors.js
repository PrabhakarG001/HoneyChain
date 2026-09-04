import { useColorScheme } from 'react-native';

export function useThemeColors() {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';

  return {
    isDark,
    accent: '#F59E0B',
    background: isDark ? '#0B0C10' : '#FFFFFF',
    surface: isDark ? '#16181E' : '#F8FAFC',
    text: isDark ? '#F9FAFB' : '#111827',
    subtext: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#1F2937' : '#E5E7EB',
    cardBorder: isDark ? '#374151' : '#E2E8F0',
    dockBackground: isDark ? 'rgba(11, 12, 16, 0.88)' : 'rgba(255, 255, 255, 0.88)',
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    }
  };
}
