import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, Plus, Bell, User } from 'lucide-react-native';
import { theme } from '../../theme';
import styles from './BottomNavbar.styles';

export default function BottomNavbar({ state, descriptors, navigation, onCreatePress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          if (route.name === 'search') return null; // We use search as a hidden modal or just don't render it here if it's in tabs but not nav

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCreate = route.name === 'create';

          const onPress = () => {
            if (isCreate) {
              onCreatePress();
              return;
            }

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

          const color = isFocused ? theme.colors.text.primary : theme.colors.text.muted;
          const strokeWidth = isFocused ? 2.5 : 2;

          const renderIcon = () => {
            switch (route.name) {
              case 'index':
                return <Home size={26} color={color} strokeWidth={strokeWidth} />;
              case 'explore':
                return <Search size={26} color={color} strokeWidth={strokeWidth} />;
              case 'create':
                return <Plus size={28} color={theme.colors.text.primary} strokeWidth={2.5} />;
              case 'notifications':
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
              <View style={isFocused && !isCreate ? styles.activeIndicator : null}>
                {renderIcon()}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
