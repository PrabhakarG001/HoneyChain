import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * Custom Minimalist Geometric Hexagon (Honeycomb) interlaced with an Oval Chain Link
 */
export default function LogoIcon({ 
  size = 32, 
  color,
  accentColor = '#F4B942',
  style 
}) {
  const strokeColor = color || '#000000';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style} fill="none">
      {/* Outer Hexagon (Honeycomb Cell) */}
      <Path
        d="M 50 8 L 88 30 L 88 70 L 50 92 L 12 70 L 12 30 Z"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Interlaced Oval Chain Link Left */}
      <Path
        d="M 32 40 C 32 30, 48 30, 48 40 L 48 60 C 48 70, 32 70, 32 60 Z"
        stroke={accentColor}
        strokeWidth="5"
        fill="none"
      />

      {/* Interlaced Oval Chain Link Right */}
      <Path
        d="M 52 40 C 52 30, 68 30, 68 40 L 68 60 C 68 70, 52 70, 52 60 Z"
        stroke={strokeColor}
        strokeWidth="5"
        fill="none"
      />
    </Svg>
  );
}
