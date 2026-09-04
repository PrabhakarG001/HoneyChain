import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Polygon, Circle, Path, Line, G } from 'react-native-svg';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function MicroElementsDecoration({ width: windowWidth = 800 }) {
  const colors = useThemeColors();
  const isDark = colors.isDark;

  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: -10,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    );

    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 8,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: false,
        }),
      ])
    );

    loop1.start();
    loop2.start();

    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [float1, float2]);

  // Hide or reduce on mobile screens to prevent visual clutter
  const isMobile = windowWidth < 600;
  const opacityFactor = isMobile ? 0.4 : 1.0;
  const baseOpacity = (isDark ? 0.25 : 0.35) * opacityFactor;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Floating Micro Particle Group A (Top Left Ambient Area) */}
      <Animated.View
        style={[
          styles.particleGroup,
          {
            top: '12%',
            left: '8%',
            opacity: baseOpacity,
            transform: [{ translateY: float1 }],
          },
        ]}
      >
        <Svg width="120" height="120" viewBox="0 0 120 120">
          {/* Honey droplet shape */}
          <Path
            d="M 30 15 C 30 15 20 30 20 36 C 20 42 24.5 46 30 46 C 35.5 46 40 42 40 36 C 40 30 30 15 30 15 Z"
            fill={colors.accent}
            fillOpacity="0.5"
          />
          {/* Tiny glowing dot */}
          <Circle cx="75" cy="25" r="2.5" fill={colors.accent} fillOpacity="0.8" />
          <Circle cx="85" cy="55" r="1.5" fill={colors.accent} fillOpacity="0.6" />
          {/* Hexagonal particle */}
          <Polygon
            points="50,70 56,66 62,70 62,77 56,81 50,77"
            stroke={colors.accent}
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.7"
          />
          {/* Minimal connecting dashed line */}
          <Line x1="30" y1="46" x2="50" y2="70" stroke={colors.accent} strokeWidth="0.8" strokeDasharray="2,3" strokeOpacity="0.4" />
        </Svg>
      </Animated.View>

      {/* Floating Micro Particle Group B (Top Right Ambient Area) */}
      <Animated.View
        style={[
          styles.particleGroup,
          {
            top: '15%',
            right: '8%',
            opacity: baseOpacity,
            transform: [{ translateY: float2 }],
          },
        ]}
      >
        <Svg width="130" height="130" viewBox="0 0 130 130">
          {/* Bee wing inspired delicate curve */}
          <Path
            d="M 20 40 Q 50 10 90 35 Q 60 70 20 40 Z"
            stroke={colors.accent}
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.4"
          />
          <Path
            d="M 30 42 Q 60 25 80 40"
            stroke={colors.accent}
            strokeWidth="0.75"
            fill="none"
            strokeOpacity="0.3"
          />

          {/* Tiny honey droplet */}
          <Path
            d="M 100 70 C 100 70 93 80 93 84 C 93 88 96 91 100 91 C 104 91 107 88 107 84 C 107 80 100 70 100 70 Z"
            fill={colors.accent}
            fillOpacity="0.45"
          />

          {/* Small glowing dots */}
          <Circle cx="25" cy="85" r="2" fill={colors.accent} fillOpacity="0.7" />
          <Circle cx="45" cy="100" r="1.5" fill={colors.accent} fillOpacity="0.5" />
        </Svg>
      </Animated.View>

      {/* Floating Micro Particle Group C (Mid Left Area, outside main card column) */}
      {!isMobile && (
        <Animated.View
          style={[
            styles.particleGroup,
            {
              top: '52%',
              left: '4%',
              opacity: baseOpacity * 0.8,
              transform: [{ translateY: float2 }],
            },
          ]}
        >
          <Svg width="100" height="100" viewBox="0 0 100 100">
            <Polygon
              points="30,20 38,15 46,20 46,30 38,35 30,30"
              stroke={colors.accent}
              strokeWidth="1"
              fill="none"
              strokeOpacity="0.6"
            />
            <Circle cx="38" cy="25" r="2" fill={colors.accent} fillOpacity="0.7" />
            <Line x1="46" y1="25" x2="70" y2="40" stroke={colors.accent} strokeWidth="0.8" strokeDasharray="3,3" strokeOpacity="0.35" />
            <Circle cx="70" cy="40" r="2" fill={colors.accent} fillOpacity="0.5" />
          </Svg>
        </Animated.View>
      )}

      {/* Floating Micro Particle Group D (Mid Right Area) */}
      {!isMobile && (
        <Animated.View
          style={[
            styles.particleGroup,
            {
              top: '55%',
              right: '4%',
              opacity: baseOpacity * 0.8,
              transform: [{ translateY: float1 }],
            },
          ]}
        >
          <Svg width="100" height="100" viewBox="0 0 100 100">
            <Path
              d="M 50 20 C 50 20 42 32 42 37 C 42 42 45.5 45.5 50 45.5 C 54.5 45.5 58 42 58 37 C 58 32 50 20 50 20 Z"
              fill={colors.accent}
              fillOpacity="0.4"
            />
            <Circle cx="25" cy="65" r="2" fill={colors.accent} fillOpacity="0.6" />
            <Circle cx="75" cy="30" r="1.5" fill={colors.accent} fillOpacity="0.5" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particleGroup: {
    position: 'absolute',
  },
});
