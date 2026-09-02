import React from 'react';
import { View, Text } from 'react-native';
import styles from './BrandLogo.styles';
import LogoIcon from './LogoIcon';

export default function BrandLogo({ style, iconSize = 28, textStyle }) {
  return (
    <View style={[styles.container, style]}>
      <LogoIcon size={iconSize} />
      <Text style={[styles.logoText, textStyle]}>HoneyChain</Text>
    </View>
  );
}
