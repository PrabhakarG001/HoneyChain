import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export default function UserAvatar({ user, size = 36, style }) {
  const avatarUrl = user?.avatarUrl;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  if (avatarUrl) {
    return (
      <Image 
        source={{ uri: avatarUrl }} 
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]} 
      />
    );
  }

  return (
    <View style={[
      styles.avatarCircle, 
      { width: size, height: size, borderRadius: size / 2 },
      style
    ]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.45 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarCircle: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  }
});
