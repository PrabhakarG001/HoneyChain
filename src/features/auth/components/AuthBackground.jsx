import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Polygon, Circle, Line, G } from 'react-native-svg';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function AuthBackground({ children, style }) {
  const colors = useThemeColors();
  const isDark = colors.isDark;

  const bgStart = isDark ? '#09090B' : '#FFFDF9';
  const bgMid = isDark ? '#121212' : '#FDFBF7';
  const bgEnd = isDark ? '#18181B' : '#F7F1E5';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {/* Decorative Web3 SVG Backdrop */}
      <View style={styles.svgContainer} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={bgStart} />
              <Stop offset="50%" stopColor={bgMid} />
              <Stop offset="100%" stopColor={bgEnd} />
            </LinearGradient>

            <LinearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity={isDark ? '0.15' : '0.25'} />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.02" />
            </LinearGradient>

            <LinearGradient id="nodeLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#E6A740" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#B87A22" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {/* Background fill */}
          <Polygon points="0,0 400,0 400,800 0,800" fill="url(#bgGrad)" />

          {/* Glowing background circles */}
          <Circle cx="350" cy="80" r="180" fill="url(#amberGlow)" />
          <Circle cx="40" cy="720" r="160" fill="url(#amberGlow)" />

          {/* Honeycomb Hex Grid Group (Top Right) */}
          <G opacity={isDark ? '0.1' : '0.18'}>
            <Polygon points="320,40 350,22 380,40 380,75 350,93 320,75" stroke="#B87A22" strokeWidth="1.5" fill="none" />
            <Polygon points="350,93 380,75 410,93 410,128 380,146 350,128" stroke="#E6A740" strokeWidth="1.5" fill="none" />
            <Polygon points="290,93 320,75 350,93 350,128 320,146 290,128" stroke="#B87A22" strokeWidth="1.5" fill="none" />
            <Polygon points="320,146 350,128 380,146 380,181 350,199 320,181" stroke="#E6A740" strokeWidth="1.5" fill="none" />
          </G>

          {/* Connected Web3 Blockchain Nodes & Lines (Bottom Left) */}
          <G opacity={isDark ? '0.15' : '0.25'}>
            <Line x1="30" y1="650" x2="110" y2="690" stroke="url(#nodeLine)" strokeWidth="1.5" />
            <Line x1="110" y1="690" x2="190" y2="640" stroke="url(#nodeLine)" strokeWidth="1.5" />
            <Line x1="190" y1="640" x2="250" y2="720" stroke="url(#nodeLine)" strokeWidth="1.5" />

            <Circle cx="30" cy="650" r="4" fill="#B87A22" />
            <Circle cx="110" cy="690" r="6" fill="#E6A740" />
            <Circle cx="190" cy="640" r="5" fill="#B87A22" />
            <Circle cx="250" cy="720" r="4" fill="#E6A740" />
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
  }
});
