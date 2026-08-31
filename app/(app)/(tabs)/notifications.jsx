import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../src/theme';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
});

