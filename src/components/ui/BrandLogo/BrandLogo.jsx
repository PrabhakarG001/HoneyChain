import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './BrandLogo.styles';

export default function BrandLogo({ style, iconSize = 28, textStyle }) {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../../../assets/icon.png')} 
        style={[styles.logoImage, { width: iconSize, height: iconSize }]} 
        resizeMode="contain"
      />
      <Text style={[styles.logoText, textStyle]}>ApiVera</Text>
    </View>
  );
}
