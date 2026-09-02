import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './BrandLogo.styles';
import LogoIcon from './LogoIcon';
import { theme } from '../../../theme';

export default function BrandLogo({ 
  style, 
  iconSize = 32, 
  textStyle,
  variant = 'horizontal', // 'horizontal', 'iconOnly', 'appIcon'
  themeMode = 'light'     // 'light', 'dark', 'transparent'
}) {
  const isDarkTheme = themeMode === 'dark';

  if (variant === 'iconOnly') {
    return <LogoIcon size={iconSize} style={style} />;
  }

  if (variant === 'appIcon') {
    return (
      <View style={[
        localStyles.appIconContainer, 
        { width: iconSize * 1.6, height: iconSize * 1.6, borderRadius: (iconSize * 1.6) * 0.22 },
        style
      ]}>
        <LogoIcon size={iconSize} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LogoIcon size={iconSize} />
      <View style={localStyles.textWrapper}>
        <Text style={[
          styles.logoText, 
          isDarkTheme && { color: '#FFFFFF' },
          textStyle
        ]}>
          Honey<Text style={{ color: theme.colors.primaryDark }}>Chain</Text>
        </Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconContainer: {
    backgroundColor: '#1F1A17',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  }
});
