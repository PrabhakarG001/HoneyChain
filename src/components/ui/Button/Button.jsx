import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Button.styles';
import { theme } from '../../../theme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
  const isDisabled = disabled || isLoading;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
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
        isDisabled && styles.disabled,
        { transform: [{ scale }] },
        style
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? theme.colors.primaryDark : theme.colors.white} 
        />
      ) : (
        <Text style={[
          styles.text,
          styles[`text_${variant}`],
          styles[`text_${size}`]
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
