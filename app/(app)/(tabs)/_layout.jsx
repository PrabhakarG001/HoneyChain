import React from 'react';
import { Tabs } from 'expo-router';
import BottomNavbar from '../../../src/components/navigation/BottomNavbar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavbar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Search' }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: 'Scan' }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
