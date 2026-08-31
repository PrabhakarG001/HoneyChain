import React from 'react';
import { View } from 'react-native';
import { theme } from '../../../src/theme';

export default function CreateScreen() {
  // This screen acts as a placeholder. The actual Create menu is handled by BottomNavbar
  return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
}
