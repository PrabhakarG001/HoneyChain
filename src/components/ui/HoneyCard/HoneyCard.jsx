import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Alert, StyleSheet } from 'react-native';
import { Heart, MoreHorizontal } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';

const FALLBACK_IMAGES = {
  honey: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80',
  hive: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80',
  farm: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80',
  batch: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80',
};

export default function HoneyCard({ 
  type = 'honey', 
  title, 
  subtitle,
  imageUrl,
  height = 200,
  isVerified,
  onPress,
  badgeText
}) {
  const colors = useThemeColors();
  const [isSaved, setIsSaved] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const toggleSave = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleMorePress = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    Alert.alert('Options', title, [
      { text: isSaved ? 'Remove from Saved' : 'Save to Board', onPress: () => setIsSaved(!isSaved) },
      { text: 'Share Honey Link', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${subtitle || ''}`}
      >
        {/* Card Image Container */}
        <View style={[styles.imageContainer, { height, backgroundColor: colors.surface }]}>
          <Image 
            source={{ uri: imageUrl || FALLBACK_IMAGES[type] || FALLBACK_IMAGES.honey }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={[
              styles.favoriteButton, 
              { backgroundColor: isSaved ? colors.accent : (colors.isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.9)') }
            ]} 
            onPress={toggleSave}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Unsave item" : "Save item"}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart 
              size={16} 
              color={isSaved ? '#000000' : (colors.isDark ? '#FFFFFF' : '#111827')}
              fill={isSaved ? '#000000' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        
        {/* Under Card Title & Three-Dot Menu Row */}
        <View style={styles.contentRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.subtext }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Three-Dot Menu Button */}
          <TouchableOpacity 
            style={styles.moreBtn} 
            onPress={handleMorePress}
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MoreHorizontal size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  moreBtn: {
    padding: 6,
  },
});
