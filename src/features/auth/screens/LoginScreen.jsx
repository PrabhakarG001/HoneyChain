import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { loginSchema } from '../schemas/auth.schema';
import styles from './LoginScreen.styles';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [globalError, setGlobalError] = useState('');
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setGlobalError('');
      const res = await authService.login(data.email, data.password);
      await login(res.user, res.accessToken);
      router.replace('/(app)/dashboard');
    } catch (err) {
      setGlobalError(err.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Sign in to HoneyChain</Text>
      </View>

      {globalError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{globalError}</Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="beekeeper@honeychain.dev"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="********"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button 
        title="Login" 
        onPress={handleSubmit(onSubmit)} 
        isLoading={isSubmitting} 
      />

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button 
        title="Continue with Google" 
        onPress={() => {}} 
        variant="outline" 
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerLink}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
