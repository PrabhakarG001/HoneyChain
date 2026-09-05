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
import { useRouter, useLocalSearchParams } from 'expo-router';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  Mail, 
  Lock, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  X,
  Globe
} from 'lucide-react-native';

import { FaFileContract, FaMicrochip } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { SiEthereum } from 'react-icons/si';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import AuthBackground from '../components/AuthBackground';
import { authService } from '../../../services/auth.service';
import { firestoreService } from '../../../services/firestore.service';
import { useAuthStore } from '../../../store/auth.store';
import { loginSchema } from '../schemas/auth.schema';
import GoogleIcon from '../../../components/ui/GoogleIcon';
import { useAuth } from '../../../context/AuthContext';
import styles from './LoginScreen.styles';
import { theme } from '../../../theme';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function LoginScreen() {
  const router = useRouter();
  const { role: paramRole } = useLocalSearchParams();
  const { user: authContextUser, loading: authContextLoading, loginWithGoogle } = useAuth();
  const { isAuthenticated, isLoading: storeIsLoading, updateUser } = useAuthStore();
  const { t, currentLanguage } = useTranslation();
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;
  
  const login = useAuthStore(state => state.login);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!storeIsLoading && isAuthenticated) {
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, storeIsLoading]);

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
      
      const userRole = paramRole ? paramRole.toUpperCase() : (res.user?.role || 'CUSTOMER');
      const finalUser = { ...res.user, role: userRole };
      await login(finalUser, res.accessToken);
      if (paramRole && res.user?.uid) {
        await firestoreService.updateUserRole(res.user.uid, userRole);
      }

      setTimeout(() => {
        router.replace('/(app)/(tabs)');
      }, 500);
    } catch (err) {
      setGlobalError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isSubmitting) return;
    try {
      setGlobalError('');
      setSuccessMsg('');
      setIsGoogleLoading(true);

      const userRole = paramRole ? paramRole.toUpperCase() : 'CUSTOMER';
      const gUser = await loginWithGoogle(userRole);
      setSuccessMsg('Google Sign-In successful! Opening HoneyChain...');

      if (gUser?.uid) {
        const gPhoto = gUser.photoURL || gUser.providerData?.[0]?.photoURL || '';
        updateUser({ 
          role: userRole,
          photoURL: gPhoto,
          avatarUrl: gPhoto,
          avatar_url: gPhoto,
          profileImage: gPhoto
        });
        firestoreService.updateUserRole(gUser.uid, userRole).catch(() => {});
      }

      router.replace('/(app)/(tabs)');
    } catch (err) {
      // Don't show error if user cancelled popup
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      setGlobalError(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
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
                  <SiEthereum size={12} color="#F4B942" style={{ marginRight: 6 }} />
                  <Text style={styles.showcaseBadgeText}>HoneyChain Protocol v2.4</Text>
                </View>

                <Text style={styles.showcaseTitle}>
                  Track every batch. Verify every hive.
                </Text>
                
                <Text style={styles.showcaseSubtitle}>
                  Connect your IoT-enabled hives, monitor hive conditions in real time, and create tamper-resistant honey provenance records on-chain.
                </Text>

                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <FaFileContract size={18} color="#F4B942" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>Blockchain Passports</Text>
                      <Text style={styles.featureDesc}>Timestamped and verifiable honey batch records secured by smart contracts.</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <FaMicrochip size={18} color="#F4B942" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>Hive Telemetry</Text>
                      <Text style={styles.featureDesc}>Monitor temperature, humidity, and hive sound data from connected IoT devices.</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <MdVerified size={20} color="#F4B942" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>On-Chain Verification</Text>
                      <Text style={styles.featureDesc}>Verify batch history and provenance without relying on a centralized database.</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.showcaseFooter}>
                  <Text style={styles.showcaseFooterText}>Network Status: Connected</Text>
                </View>
              </View>
            )}

            {/* Auth Form Card */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, isDesktop && styles.desktopCard]}>
              <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
                  <BrandLogo style={styles.logoStyle} iconSize={36} />
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background }}
                    onPress={() => setIsLangModalVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Select language"
                  >
                    <Globe size={16} color={colors.accent} />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{currentLanguage.native}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.title, { color: colors.text }]}>{t('welcomeBack', 'Welcome Back')}</Text>
                <Text style={[styles.subtitle, { color: colors.subtext }]}>{t('signInSubtitle', 'Sign in to your HoneyChain account')}</Text>
              </View>

              {/* Error Feedback Banner */}
              {globalError ? (
                <View style={[styles.errorBox, { backgroundColor: colors.isDark ? '#371B1B' : '#FEE2E2', borderColor: colors.status.error + '44' }]}>
                  <AlertCircle size={20} color={colors.status.error} style={{ marginRight: 8 }} />
                  <Text style={[styles.errorText, { color: colors.status.error }]}>{globalError}</Text>
                </View>
              ) : null}

              {/* Success Feedback Banner */}
              {successMsg ? (
                <View style={[styles.successBox, { backgroundColor: colors.isDark ? '#14291F' : '#DCFCE7', borderColor: colors.status.success + '44' }]}>
                  <CheckCircle2 size={20} color={colors.status.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.successText, { color: colors.status.success }]}>{successMsg}</Text>
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
                    leftIcon={<Mail size={20} color={colors.subtext} />}
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
                    leftIcon={<Lock size={20} color={colors.subtext} />}
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
                    <CheckSquare size={18} color={colors.accent} />
                  ) : (
                    <Square size={18} color={colors.subtext} />
                  )}
                  <Text style={[styles.rememberMeText, { color: colors.subtext }]}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setForgotModalVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                >
                  <Text style={[styles.forgotPasswordText, { color: colors.accent }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Submit Button */}
              <Button 
                title="Sign In" 
                onPress={handleSubmit(onSubmit)} 
                isLoading={isSubmitting} 
                style={styles.submitBtn}
                icon={<ArrowRight size={18} color="#000000" />}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.subtext }]}>OR CONTINUE WITH</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Google Sign-In Button */}
              <TouchableOpacity
                style={[
                  styles.googleBtn, 
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  (isGoogleLoading || isSubmitting) && styles.googleBtnDisabled
                ]}
                onPress={handleGoogleLogin}
                disabled={isGoogleLoading || isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <View style={styles.googleBtnContent}>
                    <GoogleIcon size={20} style={{ marginRight: 10 }} />
                    <Text style={[styles.googleBtnText, { color: colors.text }]}>Continue with Google</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ height: 16 }} />

              {/* Sign Up Link */}
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.subtext }]}>Don't have an account? </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(auth)/register')}
                  accessibilityRole="link"
                  accessibilityLabel="Create Account"
                >
                  <Text style={[styles.footerLink, { color: colors.accent }]}>Create Account</Text>
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
            <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setForgotModalVisible(false)}
              >
                <X size={20} color={colors.subtext} />
              </TouchableOpacity>

              <BrandLogo iconSize={32} style={{ marginBottom: 12 }} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Reset Password</Text>
              <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>
                Enter your account email to receive instructions to reset your password.
              </Text>

              {resetSent ? (
                <View style={[styles.successBox, { backgroundColor: colors.isDark ? '#14291F' : '#DCFCE7' }]}>
                  <CheckCircle2 size={20} color={colors.status.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.successText, { color: colors.status.success }]}>Password reset instructions sent to your email!</Text>
                </View>
              ) : (
                <>
                  <Input
                    label="Account Email"
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    leftIcon={<Mail size={20} color={colors.subtext} />}
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

        {/* Language Selection Modal */}
        <LanguageModal
          isVisible={isLangModalVisible}
          onClose={() => setIsLangModalVisible(false)}
        />

      </KeyboardAvoidingView>
    </AuthBackground>
  );
}
