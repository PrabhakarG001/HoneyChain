import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Polygon, Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function HoneycombDecoration({ width: windowWidth = 800 }) {
  const colors = useThemeColors();
  const isDark = colors.isDark;
  
  const pulseAnim = useRef(new Animated.Value(0.7)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 3500,
          useNativeDriver: false,
        }),
      ])
    );

    // Floating animation
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    );

    pulseLoop.start();
    floatLoop.start();

    return () => {
      pulseLoop.stop();
      floatLoop.stop();
    };
  }, [pulseAnim, floatAnim]);

  // Responsive scale down on small screens
  const isMobile = windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 1024;
  const svgWidth = isMobile ? 180 : isTablet ? 260 : 320;
  const svgHeight = isMobile ? 180 : isTablet ? 260 : 320;

  const baseOpacity = isDark ? 0.28 : 0.38;

  return (
    <View style={[styles.container, { width: svgWidth, height: svgHeight }]} pointerEvents="none">
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          opacity: pulseAnim.interpolate({
            inputRange: [0.7, 1],
            outputRange: [baseOpacity * 0.75, baseOpacity],
          }),
          transform: [{ translateY: floatAnim }],
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 320 320">
          <Defs>
            <RadialGradient id="hcGlow" cx="20%" cy="80%" r="60%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity={isDark ? "0.3" : "0.4"} />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Soft background glow from corner */}
          <Circle cx="40" cy="280" r="140" fill="url(#hcGlow)" />

          {/* Partial Honeycomb Hex Grid Group (Bottom Left) */}
          <G stroke={colors.accent} strokeWidth="1.2" fill="none">
            {/* Hexagon 1 - Bottom Left Corner Root */}
            <Polygon points="10,250 40,233 70,250 70,284 40,301 10,284" strokeOpacity="0.85" />
            
            {/* Hexagon 2 - Above Hex 1 */}
            <Polygon points="10,182 40,165 70,182 70,216 40,233 10,216" strokeOpacity="0.7" />

            {/* Hexagon 3 - Right of Hex 1 */}
            <Polygon points="70,216 100,199 130,216 130,250 100,267 70,250" strokeOpacity="0.8" />

            {/* Hexagon 4 - Far Right Bottom */}
            <Polygon points="130,250 160,233 190,250 190,284 160,301 130,284" strokeOpacity="0.6" />

            {/* Hexagon 5 - Top-Right Tier */}
            <Polygon points="70,148 100,131 130,148 130,182 100,199 70,182" strokeOpacity="0.65" />

            {/* Hexagon 6 - High Upper Corner */}
            <Polygon points="130,182 160,165 190,182 190,216 160,233 130,216" strokeOpacity="0.5" />

            {/* Hexagon 7 - Distant Edge Hex */}
            <Polygon points="190,216 220,199 250,216 250,250 220,267 190,250" strokeOpacity="0.35" />

            {/* Hexagon 8 - Top Edge Hex */}
            <Polygon points="130,114 160,97 190,114 190,148 160,165 130,148" strokeOpacity="0.3" />
          </G>

          {/* Tiny Glowing Connection Points */}
          <G fill={colors.accent}>
            <Circle cx="70" cy="250" r="3.5" fillOpacity="0.9" />
            <Circle cx="40" cy="233" r="3" fillOpacity="0.8" />
            <Circle cx="100" cy="199" r="4" fillOpacity="0.95" />
            <Circle cx="130" cy="250" r="3.5" fillOpacity="0.85" />
            <Circle cx="160" cy="165" r="3" fillOpacity="0.75" />
            <Circle cx="190" cy="216" r="2.5" fillOpacity="0.6" />
          </G>

          {/* Outer glowing halo on main nodes */}
          <G fill="none" stroke={colors.accent} strokeWidth="1">
            <Circle cx="100" cy="199" r="7" strokeOpacity="0.4" />
            <Circle cx="70" cy="250" r="6" strokeOpacity="0.3" />
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
    left: -10,
    zIndex: 1,
  },
});
