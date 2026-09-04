import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { theme } from '../../src/theme';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.main }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="farms/index" />
      <Stack.Screen name="farms/add" />
      <Stack.Screen name="farms/[id]" />
      <Stack.Screen name="hives/add" />
      <Stack.Screen name="hives/[id]" />
      <Stack.Screen name="batches/create" />
      <Stack.Screen name="batches/[id]" />
    </Stack>
  );
}
