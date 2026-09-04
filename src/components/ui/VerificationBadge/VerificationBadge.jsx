import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Cpu } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function VerificationBadge({ type = 'blockchain', text }) {
  const colors = useThemeColors();
  const isBlockchain = type === 'blockchain';
  const Icon = isBlockchain ? ShieldCheck : Cpu;
  const label = text || (isBlockchain ? 'Blockchain Verified' : 'AI Verified');

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.badgeBg, 
        borderColor: colors.badgeBorder 
      }
    ]}>
      <Icon size={13} color={colors.accent} />
      <Text style={[styles.text, { color: colors.accent }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
});
