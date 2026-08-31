import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Input.styles';
import { theme } from '../../../theme';

export function Input({ 
  label, 
  error, 
  style,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[
        styles.inputWrapper, 
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  style: PropTypes.object
};

export default Input;
