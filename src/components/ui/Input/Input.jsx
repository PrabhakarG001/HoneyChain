import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react-native';
import styles from './Input.styles';
import { theme } from '../../../theme';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'hide-native-password-reveal';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(`
      input::-ms-reveal,
      input::-ms-clear {
        display: none !important;
      }
    `));
    document.head.appendChild(style);
  }
}

import { useThemeColors } from '../../../hooks/useThemeColors';

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
  const colors = useThemeColors();
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
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <View style={[
        styles.inputWrapper,
        { backgroundColor: colors.inputBg, borderColor: colors.inputBorder },
        isFocused && { borderColor: colors.accent, backgroundColor: colors.inputBg },
        error && { borderColor: colors.status.error, backgroundColor: colors.isDark ? '#2D1B1B' : '#FEF2F2' }
      ]}>
        {leftIcon ? <View style={styles.leftIconContainer}>{leftIcon}</View> : null}
        
        <TextInput
          style={[styles.input, { color: colors.inputText }, leftIcon && styles.inputWithLeftIcon]}
          value={value ?? ''}
          placeholderTextColor={colors.inputPlaceholder}
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
              <EyeOff size={20} color={colors.subtext} />
            ) : (
              <Eye size={20} color={colors.subtext} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? <Text style={[styles.errorText, { color: colors.status.error }]}>{error}</Text> : null}
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

