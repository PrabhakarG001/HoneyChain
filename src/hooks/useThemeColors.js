import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useThemeStore } from '../store/theme.store';
import { useEffect } from 'react';

export function useThemeColors() {
  const systemScheme = useNativeColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const loadPersistedTheme = useThemeStore((state) => state.loadPersistedTheme);

  useEffect(() => {
    loadPersistedTheme();
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const accent = '#F4B942'; // Premium Honey Gold Accent

  if (isDark) {
    return {
      isDark: true,
      mode: themeMode,
      accent,
      background: '#0B0C10',        // Deep Black / Near Black
      surface: '#16181E',           // Near Black surface
      cardBackground: '#121212',
      text: '#FFFFFF',              // White
      subtext: '#9CA3AF',           // Light Grey
      border: '#27272A',            // Subtle Dark Border
      cardBorder: '#27272A',
      dockBackground: 'rgba(11, 12, 16, 0.92)',
      icon: '#FFFFFF',
      buttonBg: '#FFFFFF',
      buttonText: '#000000',
      accentButtonBg: accent,
      accentButtonText: '#000000',
      badgeBg: 'rgba(244, 185, 66, 0.15)',
      badgeBorder: 'rgba(244, 185, 66, 0.35)',
      badgeText: accent,
      status: {
        success: accent,            // Verification uses Honey Gold
        warning: accent,
        error: '#EF4444',           // System critical errors only
      }
    };
  }

  // Light Mode
  return {
    isDark: false,
    mode: themeMode,
    accent,
    background: '#FFFFFF',          // White
    surface: '#F8FAFC',             // Light Neutral Surface
    cardBackground: '#FFFFFF',
    text: '#000000',                // Black
    subtext: '#6B7280',             // Light Grey
    border: '#E5E7EB',              // Subtle Light Border
    cardBorder: '#E5E7EB',
    dockBackground: 'rgba(255, 255, 255, 0.92)',
    icon: '#000000',
    buttonBg: '#000000',
    buttonText: '#FFFFFF',
    accentButtonBg: accent,
    accentButtonText: '#000000',
    badgeBg: 'rgba(244, 185, 66, 0.12)',
    badgeBorder: 'rgba(244, 185, 66, 0.3)',
    badgeText: accent,
    status: {
      success: accent,              // Verification uses Honey Gold
      warning: accent,
      error: '#DC2626',             // System critical errors only
    }
  };
}
