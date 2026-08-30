import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
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
