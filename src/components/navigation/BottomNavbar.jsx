import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, Plus, Bell, User, MapPin, QrCode, Bookmark, Box, Database, Shield } from 'lucide-react-native';
import { theme } from '../../theme';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';

export default function BottomNavbar({ state, descriptors, navigation, onCreatePress }) {
  const insets = useSafeAreaInsets();
  const isNavbarVisible = useUIStore(state => state.isNavbarVisible);
  const setNavbarVisible = useUIStore(state => state.setNavbarVisible);
  const { user } = useAuthStore();
  const userRole = (user?.role || 'BEEKEEPER').toUpperCase();

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isNavbarVisible ? 0 : 120, // 120 pushes it smoothly out of view
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [isNavbarVisible]);

  return (
    <Animated.View 
      style={[
        styles.wrapper, 
        { 
          paddingBottom: Math.max(insets.bottom, 12), 
          transform: [{ translateY }] 
        }
      ]}
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          if (route.name === 'search') return null;

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenterAction = route.name === 'create';

          const onPress = () => {
            // Keep navbar visible on tab touch
            setNavbarVisible(true);

            if (isCenterAction) {
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

          const color = isFocused ? theme.colors.primaryDark || '#D97706' : '#94A3B8';
          const strokeWidth = isFocused ? 2.5 : 2;

          const renderIcon = () => {
            switch (route.name) {
              case 'index':
                return <Home size={24} color={color} strokeWidth={strokeWidth} />;
              case 'map':
                return userRole === 'CUSTOMER' 
                  ? <Search size={24} color={color} strokeWidth={strokeWidth} />
                  : <MapPin size={24} color={color} strokeWidth={strokeWidth} />;
              case 'explore':
                return <Search size={24} color={color} strokeWidth={strokeWidth} />;
              case 'create':
                return userRole === 'CUSTOMER'
                  ? <QrCode size={26} color="#FFFFFF" strokeWidth={2.5} />
                  : <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />;
              case 'notifications':
                return <Bookmark size={24} color={color} strokeWidth={strokeWidth} />;
              case 'profile':
                return <User size={24} color={color} strokeWidth={strokeWidth} />;
              default:
                return <Box size={24} color={color} strokeWidth={strokeWidth} />;
            }
          };

          const getLabel = () => {
            if (isCenterAction) return userRole === 'CUSTOMER' ? 'Scan' : 'Create';
            switch (route.name) {
              case 'index': return 'Home';
              case 'explore': return 'Discover';
              case 'map': return userRole === 'CUSTOMER' ? 'Discover' : 'Apiaries';
              case 'notifications': return 'Saved';
              case 'profile': return 'Profile';
              default: return route.name;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[styles.tabItem, isCenterAction && styles.centerItemWrapper]}
              activeOpacity={0.8}
            >
              {isCenterAction ? (
                <View style={styles.centerBtn}>
                  {renderIcon()}
                </View>
              ) : (
                <View style={styles.iconColumn}>
                  {renderIcon()}
                  <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                    {getLabel()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 99,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 64,
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#D97706',
    fontWeight: '700',
  },
  centerItemWrapper: {
    top: -12,
  },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#D97706',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
