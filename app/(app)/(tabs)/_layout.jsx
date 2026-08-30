import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, ScanLine, Heart, User } from 'lucide-react-native';
import { theme } from '../../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryDark,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
        },
        tabBarLabelStyle: {
          ...theme.typography.caption,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => (
            <ScanLine 
              size={28} 
              color={theme.colors.white} 
              style={{
                backgroundColor: theme.colors.primaryDark,
                borderRadius: theme.radius.full,
                padding: 4,
                overflow: 'hidden',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
