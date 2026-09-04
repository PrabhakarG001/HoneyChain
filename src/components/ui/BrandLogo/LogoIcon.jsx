import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

/**
 * Premium HoneyChain Brand Icon: White "H" on a Honey/Golden Squircle Badge
 */
export default function LogoIcon({ 
  size = 32, 
  badgeColor = '#F4B942', // Warm Honey Gold
  hColor = '#FFFFFF',      // Crisp White H
  style 
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style} fill="none">
      {/* Honey Golden Squircle Container */}
      <Rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="26"
        ry="26"
        fill={badgeColor}
      />

      {/* Clean, Modern, Minimal White H Symbol */}
      <Path
        d="M 26 28 C 26 25.8 27.8 24 30 24 L 35 24 C 37.2 24 39 25.8 39 28 L 39 43.5 L 61 43.5 L 61 28 C 61 25.8 62.8 24 65 24 L 70 24 C 72.2 24 74 25.8 74 28 L 74 72 C 74 74.2 72.2 76 70 76 L 65 76 C 62.8 76 61 74.2 61 72 L 61 56.5 L 39 56.5 L 39 72 C 39 74.2 37.2 76 35 76 L 30 76 C 27.8 76 26 74.2 26 72 Z"
        fill={hColor}
      />
    </Svg>
  );
}
