import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Polygon, Circle, G } from 'react-native-svg';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function AuthBackground({ children, style }) {
  const colors = useThemeColors();
  const isDark = colors.isDark;

  const bgStart = isDark ? '#0B0C10' : '#FFFFFF';
  const bgMid = isDark ? '#12141A' : '#FDFBF7';
  const bgEnd = isDark ? '#16181E' : '#F7F1E5';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {/* Decorative HoneyChain Backdrop */}
      <View style={styles.svgContainer} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={bgStart} />
              <Stop offset="50%" stopColor={bgMid} />
              <Stop offset="100%" stopColor={bgEnd} />
            </LinearGradient>

            <RadialGradient id="centralHoneyGlow" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity={isDark ? '0.12' : '0.18'} />
              <Stop offset="70%" stopColor={colors.accent} stopOpacity={isDark ? '0.03' : '0.04'} />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="amberGlowTop" cx="80%" cy="10%" r="45%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity={isDark ? '0.15' : '0.2'} />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Background base fill */}
          <Polygon points="0,0 400,0 400,800 0,800" fill="url(#bgGrad)" />

          {/* Central & Top Ambient Honey Radial Glow */}
          <Circle cx="200" cy="350" r="300" fill="url(#centralHoneyGlow)" />
          <Circle cx="350" cy="80" r="180" fill="url(#amberGlowTop)" />

          {/* Minimal upper honeycomb accent pattern (Top Right subtle) */}
          <G opacity={isDark ? '0.08' : '0.14'} stroke={colors.accent} strokeWidth="1.2" fill="none">
            <Polygon points="320,40 350,22 380,40 380,75 350,93 320,75" />
            <Polygon points="350,93 380,75 410,93 410,128 380,146 350,128" />
            <Polygon points="290,93 320,75 350,93 350,128 320,146 290,128" />
          </G>
        </Svg>
      </View>

      {/* Foreground Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
