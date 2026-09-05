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
      background: '#090A0F',        // Deep Slate Black
      surface: '#14161F',           // Dark Surface Card
      cardBackground: '#14161F',
      text: '#FFFFFF',              // Pure White
      subtext: '#9CA3AF',           // Highly Readable Light Slate Grey
      border: '#272A36',            // Visible Subtle Border
      cardBorder: '#272A36',
      dockBackground: 'rgba(9, 10, 15, 0.94)',
      icon: '#FFFFFF',
      buttonBg: '#FFFFFF',
      buttonText: '#090A0F',
      accentButtonBg: accent,
      accentButtonText: '#000000',
      inputBg: '#1A1D28',
      inputText: '#FFFFFF',
      inputPlaceholder: '#71717A',
      inputBorder: '#272A36',
      modalOverlay: 'rgba(0, 0, 0, 0.75)',
      badgeBg: 'rgba(244, 185, 66, 0.16)',
      badgeBorder: 'rgba(244, 185, 66, 0.38)',
      badgeText: accent,
      status: {
        success: accent,
        warning: accent,
        error: '#EF4444',
      }
    };
  }

  // Light Mode - High Contrast Slate Palette
  return {
    isDark: false,
    mode: themeMode,
    accent,
    background: '#F8FAFC',          // Soft Cool Light Neutral
    surface: '#FFFFFF',             // Pure White Card
    cardBackground: '#FFFFFF',
    text: '#0F172A',                // Deep Slate Black (WCAG AAA)
    subtext: '#475569',             // Clear Dark Slate Grey
    border: '#E2E8F0',              // Crisp Visible Border
    cardBorder: '#E2E8F0',
    dockBackground: 'rgba(255, 255, 255, 0.95)',
    icon: '#0F172A',
    buttonBg: '#0F172A',
    buttonText: '#FFFFFF',
    accentButtonBg: accent,
    accentButtonText: '#000000',
    inputBg: '#FFFFFF',
    inputText: '#0F172A',
    inputPlaceholder: '#64748B',
    inputBorder: '#CBD5E1',
    modalOverlay: 'rgba(15, 23, 42, 0.65)',
    badgeBg: 'rgba(244, 185, 66, 0.14)',
    badgeBorder: 'rgba(244, 185, 66, 0.4)',
    badgeText: '#B47B00',
    status: {
      success: '#B47B00',
      warning: '#B47B00',
      error: '#DC2626',
    }
  };
}
