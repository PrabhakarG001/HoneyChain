import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Heart, Home, Box, Feather } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './HoneyCard.styles';
import VerificationBadge from '../VerificationBadge/VerificationBadge';

const renderFallbackIcon = (type) => {
  switch (type) {
    case 'farm': return <Home size={36} color={theme.colors.primaryDark} />;
    case 'hive': return <Feather size={36} color={theme.colors.primaryDark} />;
    default: return <Box size={36} color={theme.colors.primaryDark} />;
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
        <View style={[styles.imageContainer, { height, backgroundColor: theme.colors.primaryLight }]}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.amber50 || '#FFFBEB' }}>
              {renderFallbackIcon(type)}
            </View>
          )}
          
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleSave}>
            <Heart 
              size={18} 
              color={isSaved ? theme.colors.status.error : theme.colors.charcoal}
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
