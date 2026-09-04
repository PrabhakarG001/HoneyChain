import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { 
  Mail, 
  Lock, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Hexagon, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react-native';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import AuthBackground from '../components/AuthBackground';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { loginSchema } from '../schemas/auth.schema';
import { getItemAsync, setItemAsync, deleteItemAsync } from '../../../utils/storage';
import styles from './LoginScreen.styles';
import { theme } from '../../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;
  
  const login = useAuthStore(state => state.login);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const rememberMeValue = watch('rememberMe');

  // Load remembered email on mount
  useEffect(() => {
    (async () => {
      try {
        const savedEmail = await getItemAsync('remembered_email');
        if (savedEmail) {
          setValue('email', savedEmail);
          setValue('rememberMe', true);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setGlobalError('');
      setSuccessMsg('');

      // Handle remember me storage
      if (data.rememberMe) {
        await setItemAsync('remembered_email', data.email);
      } else {
        await deleteItemAsync('remembered_email');
      }

      const res = await authService.login(data.email, data.password);
      setSuccessMsg('Authenticated! Entering HoneyChain network...');
      
      await login(res.user, res.accessToken);

      setTimeout(() => {
        router.replace('/(app)/dashboard');
      }, 500);
    } catch (err) {
      setGlobalError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPasswordSubmit = () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModalVisible(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            isDesktop && styles.desktopScrollContent
          ]} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.mainContainer, isDesktop && styles.desktopContainer]}>
            
            {/* Desktop Side Banner (Showcase Web3 HoneyChain) */}
            {isDesktop && (
              <View style={styles.showcaseSide}>
                <View style={styles.showcaseBadge}>
                  <Hexagon size={18} color="#E6A740" fill="#E6A74022" />
                  <Text style={styles.showcaseBadgeText}>HoneyChain Protocol v2.4</Text>
                </View>

                <Text style={styles.showcaseTitle}>
                  Decentralized Honey Provenance & Hive Telemetry
                </Text>
                
                <Text style={styles.showcaseSubtitle}>
                  Connect directly to your IoT hives, inspect immutable batch passports, and verify pure honey quality on-chain.
                </Text>

                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <ShieldCheck size={22} color="#E6A740" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>Blockchain Passport</Text>
                      <Text style={styles.featureDesc}>Smart contract timestamped honey batches</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <Sparkles size={22} color="#E6A740" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>IoT Hive Analytics</Text>
                      <Text style={styles.featureDesc}>Real-time temperature, sound & humidity sensors</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.showcaseFooter}>
                  <Text style={styles.showcaseFooterText}>🔒 End-to-End Cryptography Encrypted</Text>
                </View>
              </View>
            )}

            {/* Auth Form Card */}
            <View style={[styles.card, isDesktop && styles.desktopCard]}>
              <View style={styles.header}>
                <BrandLogo style={styles.logoStyle} iconSize={40} />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your HoneyChain account</Text>
              </View>

              {/* Error Feedback Banner */}
              {globalError ? (
                <View style={styles.errorBox}>
                  <AlertCircle size={20} color={theme.colors.status.error} style={{ marginRight: 8 }} />
                  <Text style={styles.errorText}>{globalError}</Text>
                </View>
              ) : null}

              {/* Success Feedback Banner */}
              {successMsg ? (
                <View style={styles.successBox}>
                  <CheckCircle2 size={20} color={theme.colors.status.success} style={{ marginRight: 8 }} />
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              ) : null}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email or Username"
                    placeholder="beekeeper@honeychain.dev"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    leftIcon={<Mail size={20} color={theme.colors.text.secondary} />}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    error={errors.email?.message}
                    accessibilityLabel="Email or Username"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    isPassword={true}
                    leftIcon={<Lock size={20} color={theme.colors.text.secondary} />}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    error={errors.password?.message}
                    accessibilityLabel="Password"
                  />
                )}
              />

              {/* Options Row: Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={styles.rememberMe}
                  onPress={() => setValue('rememberMe', !rememberMeValue)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: rememberMeValue }}
                  accessibilityLabel="Remember me"
                >
                  {rememberMeValue ? (
                    <CheckSquare size={18} color={theme.colors.primaryDark} />
                  ) : (
                    <Square size={18} color={theme.colors.text.muted} />
                  )}
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setForgotModalVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Submit Button */}
              <Button 
                title="Sign In" 
                onPress={handleSubmit(onSubmit)} 
                isLoading={isSubmitting} 
                style={styles.submitBtn}
                icon={<ArrowRight size={18} color="#FFFFFF" />}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>SECURE AUTHENTICATION</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign Up Link */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(auth)/register')}
                  accessibilityRole="link"
                  accessibilityLabel="Create Account"
                >
                  <Text style={styles.footerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* Forgot Password Modal */}
        <Modal
          visible={forgotModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setForgotModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setForgotModalVisible(false)}
              >
                <X size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>

              <BrandLogo iconSize={32} style={{ marginBottom: 12 }} />
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalSubtitle}>
                Enter your account email to receive instructions to reset your password.
              </Text>

              {resetSent ? (
                <View style={styles.successBox}>
                  <CheckCircle2 size={20} color={theme.colors.status.success} style={{ marginRight: 8 }} />
                  <Text style={styles.successText}>Password reset instructions sent to your email!</Text>
                </View>
              ) : (
                <>
                  <Input
                    label="Account Email"
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    leftIcon={<Mail size={20} color={theme.colors.text.secondary} />}
                    value={resetEmail}
                    onChangeText={setResetEmail}
                  />
                  <Button 
                    title="Send Reset Instructions" 
                    onPress={handleForgotPasswordSubmit}
                    style={{ marginTop: 8 }}
                  />
                </>
              )}
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </AuthBackground>
  );
}
