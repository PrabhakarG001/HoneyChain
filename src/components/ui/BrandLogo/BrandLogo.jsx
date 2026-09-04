import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogoIcon from './LogoIcon';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function BrandLogo({ 
  style, 
  iconSize = 32, 
  textStyle,
  showText = true,
  badgeColor,
}) {
  const colors = useThemeColors();
  const effectiveBadgeColor = badgeColor || colors.accent || '#F4B942';

  return (
    <View style={[styles.container, style]}>
      <LogoIcon size={iconSize} badgeColor={effectiveBadgeColor} hColor="#FFFFFF" />
      {showText && (
        <Text style={[styles.logoText, { color: colors.text }, textStyle]}>
          HoneyChain
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
