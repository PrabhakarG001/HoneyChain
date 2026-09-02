import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, G, Polygon } from 'react-native-svg';
import { theme } from '../../../theme';

/**
 * HoneyChain Premium Brand Icon Symbol
 * 
 * Geometry Concept:
 * Interlocking geometric isometric honeycomb cell containing a subtle 'H' / 'HC'
 * constructed from connected blockchain nodes/blocks.
 * 
 * Colors:
 * Honey Gold (#E6A740) & Honey Bronze (#B87A22) with Deep Charcoal (#1F1A17) accents.
 */
export default function LogoIcon({ 
  size = 32, 
  primaryColor = '#E6A740', 
  darkColor = '#B87A22',
  accentColor = '#1F1A17',
  style 
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style} fill="none">
      <Defs>
        <LinearGradient id="hcAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={darkColor} />
        </LinearGradient>
        <LinearGradient id="hcGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FAEDCD" />
          <Stop offset="100%" stopColor={primaryColor} />
        </LinearGradient>
        <LinearGradient id="hcDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={accentColor} />
          <Stop offset="100%" stopColor="#3A322C" />
        </LinearGradient>
      </Defs>

      {/* Hexagonal Outer Grid Boundary */}
      <Polygon 
        points="50,6 88,28 88,72 50,94 12,72 12,28" 
        stroke="url(#hcAmberGrad)" 
        strokeWidth="4" 
        strokeLinejoin="round" 
        fill="none" 
        opacity="0.3"
      />

      {/* Left 'H' Vertical Pillar Node Block */}
      <Path 
        d="M 24 30 L 38 22 L 38 78 L 24 70 Z" 
        fill="url(#hcAmberGrad)" 
      />

      {/* Right 'H' Vertical Pillar Node Block */}
      <Path 
        d="M 62 22 L 76 30 L 76 70 L 62 78 Z" 
        fill="url(#hcAmberGrad)" 
      />

      {/* Interlocking Blockchain Crossbar Node (Forms the 'H' / Honeycomb Core) */}
      <Path 
        d="M 38 43 L 50 36 L 62 43 L 62 57 L 50 64 L 38 57 Z" 
        fill="url(#hcDarkGrad)" 
      />

      {/* Central Honeycomb Diamond Core */}
      <Path 
        d="M 50 42 L 58 50 L 50 58 L 42 50 Z" 
        fill="url(#hcGlowGrad)" 
      />

      {/* Connection Links (Nodes to Crossbar) */}
      <Path d="M 38 32 L 50 39" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
      <Path d="M 62 32 L 50 39" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
      <Path d="M 38 68 L 50 61" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
      <Path d="M 62 68 L 50 61" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
