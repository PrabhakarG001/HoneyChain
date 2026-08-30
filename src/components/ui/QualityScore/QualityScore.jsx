import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../../../theme';
import styles from './QualityScore.styles';

export default function QualityScore({ score, size = 'default' }) {
  const getScoreColor = (s) => {
    if (s >= 90) return theme.colors.status.success;
    if (s >= 75) return theme.colors.status.warning;
    return theme.colors.status.error;
  };

  const color = getScoreColor(score);
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge && styles.containerLarge, { borderColor: color }]}>
      <Text style={[styles.score, isLarge && styles.scoreLarge, { color }]}>
        {score}
      </Text>
      {isLarge && <Text style={styles.label}>QUALITY SCORE</Text>}
    </View>
  );
}
