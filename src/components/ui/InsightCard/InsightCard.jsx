import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './InsightCard.styles';

export default function InsightCard({ title, insight }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Sparkles size={16} color={theme.colors.primaryDark} strokeWidth={2} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.insight}>{insight}</Text>
    </View>
  );
}
