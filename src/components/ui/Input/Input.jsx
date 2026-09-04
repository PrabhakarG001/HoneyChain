import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react-native';
import styles from './Input.styles';
import { theme } from '../../../theme';

export function Input({ 
  label, 
  error, 
  style,
  value,
  leftIcon,
  rightIcon,
  isPassword = false,
  secureTextEntry,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[
        styles.inputWrapper, 
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError
      ]}>
        {leftIcon ? <View style={styles.leftIconContainer}>{leftIcon}</View> : null}
        
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          value={value ?? ''}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          accessibilityLabel={accessibilityLabel || label}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.text.secondary} />
            ) : (
              <Eye size={20} color={theme.colors.text.secondary} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  isPassword: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  accessibilityLabel: PropTypes.string
};

export default Input;

