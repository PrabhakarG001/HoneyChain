import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Polygon, Circle, Line, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function MolecularDecoration({ width: windowWidth = 800 }) {
  const colors = useThemeColors();
  const isDark = colors.isDark;

  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Node glowing pulse animation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    );

    // Floating animation
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 4500,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4500,
          useNativeDriver: false,
        }),
      ])
    );

    glowLoop.start();
    floatLoop.start();

    return () => {
      glowLoop.stop();
      floatLoop.stop();
    };
  }, [glowAnim, floatAnim]);

  // Responsive scale
  const isMobile = windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 1024;
  const svgWidth = isMobile ? 190 : isTablet ? 270 : 340;
  const svgHeight = isMobile ? 190 : isTablet ? 270 : 340;

  const baseOpacity = isDark ? 0.28 : 0.38;
  const amberColor = '#D97706';

  return (
    <View style={[styles.container, { width: svgWidth, height: svgHeight }]} pointerEvents="none">
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          opacity: glowAnim.interpolate({
            inputRange: [0.5, 1],
            outputRange: [baseOpacity * 0.7, baseOpacity],
          }),
          transform: [{ translateY: floatAnim }],
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 340 340">
          <Defs>
            <RadialGradient id="molGlow" cx="80%" cy="80%" r="60%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity={isDark ? "0.25" : "0.35"} />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Soft background glow in bottom right corner */}
          <Circle cx="280" cy="280" r="130" fill="url(#molGlow)" />

          {/* Chemical / Molecular Rings and Bonds */}
          <G stroke={colors.accent} strokeWidth="1.2" fill="none">
            {/* Hexagonal Sugar/Phenolic Ring 1 (Center Right) */}
            <Polygon points="240,240 270,223 300,240 300,274 270,291 240,274" strokeOpacity="0.8" />
            
            {/* Double bond representation inside ring 1 */}
            <Line x1="270" y1="230" x2="292" y2="243" strokeOpacity="0.5" strokeWidth="1" />
            <Line x1="292" y1="268" x2="270" y2="281" strokeOpacity="0.5" strokeWidth="1" />

            {/* Connecting Bond from Ring 1 to Ring 2 */}
            <Line x1="240" y1="240" x2="190" y2="210" strokeOpacity="0.75" strokeWidth="1.4" />

            {/* Hexagonal Molecular Ring 2 (Upper Left of Mol structure) */}
            <Polygon points="160,190 190,173 220,190 220,224 190,241 160,224" strokeOpacity="0.65" />
            <Line x1="190" y1="180" x2="212" y2="193" strokeOpacity="0.45" strokeWidth="1" />

            {/* Side Chains & Branches */}
            <Line x1="160" y1="190" x2="120" y2="170" strokeOpacity="0.6" strokeWidth="1.2" />
            <Line x1="120" y1="170" x2="90" y2="190" strokeOpacity="0.4" strokeWidth="1" />
            <Line x1="120" y1="170" x2="110" y2="130" strokeOpacity="0.4" strokeWidth="1" />

            {/* Branch downward from Ring 2 */}
            <Line x1="190" y1="241" x2="180" y2="285" strokeOpacity="0.55" strokeWidth="1.2" />

            {/* Branch upward from Ring 1 */}
            <Line x1="270" y1="223" x2="280" y2="175" strokeOpacity="0.6" strokeWidth="1.2" />
            <Line x1="280" y1="175" x2="320" y2="155" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3,3" />

            {/* Organic curved chemical bond */}
            <Path d="M 220 190 Q 250 150 280 175" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          </G>

          {/* Molecular Atoms / Nodes */}
          {/* Main Nodes (Gold/Amber) */}
          <G fill={colors.accent}>
            <Circle cx="270" cy="223" r="4.5" fillOpacity="0.95" />
            <Circle cx="240" cy="240" r="4" fillOpacity="0.9" />
            <Circle cx="190" cy="210" r="5" fillOpacity="1" />
            <Circle cx="160" cy="190" r="4" fillOpacity="0.85" />
            <Circle cx="120" cy="170" r="3.5" fillOpacity="0.75" />
            <Circle cx="280" cy="175" r="4" fillOpacity="0.85" />
          </G>

          {/* Secondary Oxygen / Hetero-atom nodes (Amber) */}
          <G fill={amberColor}>
            <Circle cx="300" cy="240" r="3.5" fillOpacity="0.8" />
            <Circle cx="270" cy="291" r="3.5" fillOpacity="0.8" />
            <Circle cx="220" cy="190" r="3.5" fillOpacity="0.8" />
            <Circle cx="180" cy="285" r="3.5" fillOpacity="0.7" />
            <Circle cx="90" cy="190" r="2.5" fillOpacity="0.5" />
            <Circle cx="110" cy="130" r="2.5" fillOpacity="0.5" />
          </G>

          {/* Atomic Outer Glow Rings */}
          <G fill="none" stroke={colors.accent} strokeWidth="1">
            <Circle cx="190" cy="210" r="8.5" strokeOpacity="0.4" strokeDasharray="2,2" />
            <Circle cx="270" cy="223" r="7" strokeOpacity="0.35" />
            <Circle cx="280" cy="175" r="7" strokeOpacity="0.3" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    zIndex: 1,
  },
});
