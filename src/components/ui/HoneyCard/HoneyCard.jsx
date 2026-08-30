import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, ShieldCheck } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './HoneyCard.styles';

// Simple reliable placeholder service instead of placeholder.com
const getPlaceholder = (type) => {
  switch (type) {
    case 'farm': return 'https://picsum.photos/seed/farm/400/500';
    case 'honey': return 'https://picsum.photos/seed/honey/400/600';
    case 'hive': return 'https://picsum.photos/seed/hive/400/400';
    default: return 'https://picsum.photos/seed/default/400/400';
  }
};

export default function HoneyCard({ 
  type = 'honey', // 'farm', 'honey', 'hive', 'product'
  title, 
  subtitle,
  imageUrl,
  height = 200,
  isVerified,
  onPress,
  showFavorite = false,
  badgeText
}) {
  const sourceUrl = imageUrl || getPlaceholder(type);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.imageContainer, { height }]}>
        <Image 
          source={{ uri: sourceUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={14} color={theme.colors.white} />
          </View>
        )}
        
        {showFavorite && (
          <TouchableOpacity style={styles.favoriteButton}>
            <Heart size={18} color={theme.colors.white} />
          </TouchableOpacity>
        )}
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
      </View>
    </TouchableOpacity>
  );
}
