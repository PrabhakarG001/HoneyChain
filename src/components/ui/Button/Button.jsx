import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Button.styles';
import { theme } from '../../../theme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

import { useThemeColors } from '../../../hooks/useThemeColors';

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  style,
  ...props 
}) {
  const colors = useThemeColors();
  const isDisabled = disabled || isLoading;
  const scale = useRef(new Animated.Value(1)).current;
  const useNativeDriver = Platform.OS !== 'web';

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver,
      speed: 20,
    }).start();
  };
  
  const getDynamicStyle = () => {
    if (variant === 'outline') {
      return {
        borderColor: colors.accent,
        backgroundColor: 'transparent'
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: colors.buttonBg
      };
    }
    return {
      backgroundColor: colors.accentButtonBg
    };
  };

  const getDynamicTextStyle = () => {
    if (variant === 'outline') {
      return { color: colors.text };
    }
    if (variant === 'secondary') {
      return { color: colors.buttonText };
    }
    return { color: colors.accentButtonText };
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.9}
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        styles[variant],
        styles[size],
        getDynamicStyle(),
        isDisabled && styles.disabled,
        { transform: [{ scale }] },
        style
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.text : colors.accentButtonText} 
        />
      ) : (
        <Text style={[
          styles.text,
          styles[`text_${variant}`],
          styles[`text_${size}`],
          getDynamicTextStyle()
        ]}>
          {title}
        </Text>
      )}
    </AnimatedTouchableOpacity>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object
};

export default Button;
