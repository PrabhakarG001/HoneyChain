import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, ScanLine, Bell, User } from 'lucide-react-native';
import { theme } from '../../theme';
import styles from './BottomNavbar.styles';

export default function BottomNavbar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || styles.container.paddingBottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const color = isFocused ? theme.colors.charcoal : theme.colors.text.muted;
        const strokeWidth = isFocused ? 2.5 : 2;

        const renderIcon = () => {
          switch (route.name) {
            case 'index':
              return <Home size={26} color={color} strokeWidth={strokeWidth} />;
            case 'search':
              return <Search size={26} color={color} strokeWidth={strokeWidth} />;
            case 'scan':
              return (
                <View style={[styles.scanIconContainer, { backgroundColor: isFocused ? theme.colors.charcoal : theme.colors.primaryDark }]}>
                  <ScanLine size={28} color={theme.colors.white} strokeWidth={2} />
                </View>
              );
            case 'activity':
              return <Bell size={26} color={color} strokeWidth={strokeWidth} />;
            case 'profile':
              return <User size={26} color={color} strokeWidth={strokeWidth} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {renderIcon()}
            <Text style={[styles.label, { color }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
