import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogoIcon from './LogoIcon';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function BrandLogo({ 
  style, 
  iconSize = 30, 
  textStyle
}) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, style]}>
      <LogoIcon size={iconSize} color={colors.text} accentColor={colors.accent} />
      <Text style={[styles.logoText, { color: colors.text }, textStyle]}>
        Honeychain
      </Text>
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
