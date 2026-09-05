import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, Plus, User, MapPin, QrCode, Bookmark, Box, ShoppingBag } from 'lucide-react-native';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../hooks/useTranslation';

export default function BottomNavbar({ state, descriptors, navigation, onCreatePress }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isPhone = width < 768;
  const isNavbarVisible = useUIStore(state => state.isNavbarVisible);
  const setNavbarVisible = useUIStore(state => state.setNavbarVisible);
  const { user } = useAuthStore();
  const userRole = (user?.role || 'BEEKEEPER').toUpperCase();

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isNavbarVisible ? 0 : 120,
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
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.dockBackground, 
          borderColor: colors.cardBorder 
        }
      ]}>
        {state.routes.map((route, index) => {
          if (route.name === 'search') return null;
          
          // Completely remove Saved/Notifications tab from Beekeeper bottom navigation
          if (userRole !== 'CUSTOMER' && route.name === 'notifications') {
            return null;
          }

          // Customer Phone Bottom Navigation: Home | Discover | Scan | Profile
          if (isPhone && userRole === 'CUSTOMER') {
            if (route.name === 'map' || route.name === 'notifications') return null;
          }

          const isFocused = state.index === index;
          const isCenterAction = route.name === 'create';

          const onPress = () => {
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

          const activeColor = colors.accent;
          const activeTextColor = colors.isDark ? colors.accent : '#B47B00';
          const inactiveColor = colors.subtext;
          const color = isFocused ? activeColor : inactiveColor;
          const strokeWidth = isFocused ? 2.5 : 2;

          const renderIcon = () => {
            switch (route.name) {
              case 'index':
                return <Home size={22} color={color} strokeWidth={strokeWidth} />;
              case 'map':
                return userRole === 'CUSTOMER' 
                  ? <ShoppingBag size={22} color={color} strokeWidth={strokeWidth} />
                  : <MapPin size={22} color={color} strokeWidth={strokeWidth} />;
              case 'explore':
                return <Search size={22} color={color} strokeWidth={strokeWidth} />;
              case 'create':
                return userRole === 'CUSTOMER'
                  ? <QrCode size={22} color={color} strokeWidth={strokeWidth} />
                  : <Plus size={22} color={color} strokeWidth={strokeWidth} />;
              case 'notifications':
                return <Bookmark size={22} color={color} strokeWidth={strokeWidth} />;
              case 'profile':
                return <User size={22} color={color} strokeWidth={strokeWidth} />;
              default:
                return <Box size={22} color={color} strokeWidth={strokeWidth} />;
            }
          };

          const getLabel = () => {
            if (isCenterAction) return userRole === 'CUSTOMER' ? t('scan', 'Scan') : t('create', 'Create');
            switch (route.name) {
              case 'index': return t('home', 'Home');
              case 'explore': return t('discover', 'Discover');
              case 'map': return userRole === 'CUSTOMER' ? t('store', 'Store') : t('apiaries', 'Apiaries');
              case 'notifications': return t('saved', 'Saved');
              case 'profile': return t('profile', 'Profile');
              default: return route.name;
            }
          };

          // Requirement 8 & 9: Consistent vertical icon alignment across all items (including Plus/Scan)
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={getLabel()}
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <View style={styles.iconColumn}>
                {renderIcon()}
                <Text style={[
                  styles.tabLabel, 
                  { color: inactiveColor }, 
                  isFocused && { color: activeTextColor, fontWeight: '700' }
                ]}>
                  {getLabel()}
                </Text>
              </View>
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
    zIndex: 999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 9999,
    height: 60,
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
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
    marginTop: 2,
  },
});
