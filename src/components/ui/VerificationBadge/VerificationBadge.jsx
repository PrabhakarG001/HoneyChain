import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck, Cpu } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './VerificationBadge.styles';

export default function VerificationBadge({ type = 'blockchain', text }) {
  const isBlockchain = type === 'blockchain';
  const Icon = isBlockchain ? ShieldCheck : Cpu;
  const label = text || (isBlockchain ? 'Blockchain Verified' : 'AI Verified');

  return (
    <View style={[styles.container, isBlockchain ? styles.blockchain : styles.ai]}>
      <Icon size={14} color={isBlockchain ? theme.colors.status.info : theme.colors.primaryDark} />
      <Text style={[styles.text, isBlockchain ? styles.textBlockchain : styles.textAi]}>
        {label}
      </Text>
    </View>
  );
}
