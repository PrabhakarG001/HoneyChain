import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { registerSchema } from '../schemas/auth.schema';
import { USER_ROLES } from '../../../constants/roles';
import styles from './RegisterScreen.styles';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [globalError, setGlobalError] = useState('');
  
  const { control, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: USER_ROLES.CUSTOMER }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      setGlobalError('');
      const res = await authService.register(data);
      await login(res.user, res.accessToken);
      router.replace('/(app)/dashboard');
    } catch (err) {
      setGlobalError(err.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BrandLogo style={{ marginBottom: 24, alignSelf: 'center' }} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the HoneyChain ecosystem</Text>
        </View>

        {globalError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{globalError}</Text>
          </View>
        ) : null}

        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, selectedRole === USER_ROLES.BEEKEEPER && styles.roleButtonActive]}
            onPress={() => setValue('role', USER_ROLES.BEEKEEPER)}
          >
            <Text style={[styles.roleText, selectedRole === USER_ROLES.BEEKEEPER && styles.roleTextActive]}>🐝 Beekeeper</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.roleButton, selectedRole === USER_ROLES.CUSTOMER && styles.roleButtonActive]}
            onPress={() => setValue('role', USER_ROLES.CUSTOMER)}
          >
            <Text style={[styles.roleText, selectedRole === USER_ROLES.CUSTOMER && styles.roleTextActive]}>👤 Customer</Text>
          </TouchableOpacity>
        </View>

        <Controller
          control={control} name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Full Name" placeholder="John Doe" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
          )}
        />
        <Controller
          control={control} name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
          )}
        />
        <Controller
          control={control} name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Phone Number" placeholder="+91 9876543210" keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.phone?.message} />
          )}
        />
        <Controller
          control={control} name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Password" placeholder="********" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} />
          )}
        />
        <Controller
          control={control} name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Confirm Password" placeholder="********" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.confirmPassword?.message} />
          )}
        />

        <View style={styles.submitContainer}>
          <Button title="Create Account" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
