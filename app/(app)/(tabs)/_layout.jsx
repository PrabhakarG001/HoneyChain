import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import BottomNavbar from '../../../src/components/navigation/BottomNavbar';
import CreateMenu from '../../../src/components/ui/CreateMenu/CreateMenu';

export default function TabLayout() {
  const [isCreateMenuVisible, setCreateMenuVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <BottomNavbar 
            {...props} 
            onCreatePress={() => setCreateMenuVisible(true)} 
          />
        )}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="map" options={{ title: 'Map' }} />
        <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
        <Tabs.Screen name="create" options={{ title: 'Create' }} />
        <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="search" options={{ href: null }} />
      </Tabs>
      
      <CreateMenu 
        isVisible={isCreateMenuVisible} 
        onClose={() => setCreateMenuVisible(false)} 
      />
    </>
  );
}
