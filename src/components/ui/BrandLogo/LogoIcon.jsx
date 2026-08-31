import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../theme';

/**
 * ApiVera Official Brand Icon
 * 
 * Concept: Minimalist 'A' + Honey Drop
 * The outer chevron forms the legs of the 'A' (ApiVera) and evokes a hive roof.
 * The central honey drop serves as the crossbar of the 'A', representing the core product.
 * 
 * Designed as a clean vector symbol to match the wordmark's exact color.
 */
export default function LogoIcon({ size = 28, color = theme.colors.primaryDark, style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style} fill="none">
      {/* Outer 'A' Chevron / Hive Roof */}
      <Path 
        d="M 22 85 L 50 15 L 78 85" 
        stroke={color} 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Central Honey Drop / 'A' Crossbar */}
      <Path 
        d="M 50 45 C 61 58, 61 75, 50 75 C 39 75, 39 58, 50 45 Z" 
        fill={color} 
      />
    </Svg>
  );
}
