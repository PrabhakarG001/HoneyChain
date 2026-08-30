import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './HoneyCard.styles';
import VerificationBadge from '../VerificationBadge/VerificationBadge';

const getPlaceholder = (type) => {
  switch (type) {
    case 'farm': return 'https://picsum.photos/seed/farm/400/500';
    case 'honey': return 'https://picsum.photos/seed/honey/400/600';
    case 'hive': return 'https://picsum.photos/seed/hive/400/400';
    default: return 'https://picsum.photos/seed/default/400/400';
  }
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
  const [isSaved, setIsSaved] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const sourceUrl = imageUrl || getPlaceholder(type);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const toggleSave = () => setIsSaved(!isSaved);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        <View style={[styles.imageContainer, { height }]}>
          <Image 
            source={{ uri: sourceUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleSave}>
            <Heart 
              size={18} 
              color={isSaved ? theme.colors.status.error : theme.colors.white}
              fill={isSaved ? theme.colors.status.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          )}
          {badgeText && (
            <View style={styles.textBadge}>
              <Text style={styles.textBadgeLabel}>{badgeText}</Text>
            </View>
          )}
          {isVerified && (
            <View style={styles.verifiedBadgeContainer}>
               <VerificationBadge type="blockchain" text="Verified" size="small" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
