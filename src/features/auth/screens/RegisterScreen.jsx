import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import LanguageModal from '../../../components/ui/LanguageModal/LanguageModal';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Hexagon, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Globe
} from 'lucide-react-native';

import Input from '../../../components/ui/Input/Input';
import { ActivityIndicator } from 'react-native';
import Button from '../../../components/ui/Button/Button';
import BrandLogo from '../../../components/ui/BrandLogo/BrandLogo';
import AuthBackground from '../components/AuthBackground';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { registerSchema } from '../schemas/auth.schema';
import { USER_ROLES } from '../../../constants/roles';
import GoogleIcon from '../../../components/ui/GoogleIcon';
import { useAuth } from '../../../context/AuthContext';
import styles from './RegisterScreen.styles';
import { theme } from '../../../theme';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function RegisterScreen() {
  const router = useRouter();
  const { user: authContextUser, loading: authContextLoading, loginWithGoogle } = useAuth();
  const { isAuthenticated, isLoading: storeIsLoading } = useAuthStore();
  const { t, currentLanguage } = useTranslation();
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 840;

  const login = useAuthStore(state => state.login);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!storeIsLoading && isAuthenticated) {
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, storeIsLoading]);
  
  const { control, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: USER_ROLES.BEEKEEPER,
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
    }
  });

  const selectedRole = watch('role');
  const passwordValue = watch('password');
  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data) => {
    try {
      setGlobalError('');
      setSuccessMsg('');

      const res = await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role
      });

      setSuccessMsg('Account created successfully! Connecting to HoneyChain...');
      await login(res.user, res.accessToken);

      setTimeout(() => {
        router.replace('/(app)/(tabs)');
      }, 500);
    } catch (err) {
      setGlobalError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isSubmitting) return;
    try {
      setGlobalError('');
      setSuccessMsg('');
      setIsGoogleLoading(true);

      const gUser = await loginWithGoogle();
      if (gUser?.uid) {
        const gPhoto = gUser.photoURL || gUser.providerData?.[0]?.photoURL || '';
        updateUser({ 
          photoURL: gPhoto,
          avatarUrl: gPhoto,
          avatar_url: gPhoto,
          profileImage: gPhoto
        });
      }
      setSuccessMsg('Google Sign-In successful! Connecting to HoneyChain...');

      setTimeout(() => {
        router.replace('/(app)/(tabs)');
      }, 500);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      setGlobalError(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
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
            
            {/* Desktop Side Banner */}
            {isDesktop && (
              <View style={styles.showcaseSide}>
                <View style={styles.showcaseBadge}>
                  <Hexagon size={18} color="#F4B942" fill="#F4B94222" />
                  <Text style={styles.showcaseBadgeText}>HoneyChain Network Join</Text>
                </View>

                <Text style={styles.showcaseTitle}>
                  Join the Future of Pure Honey Transparency
                </Text>
                
                <Text style={styles.showcaseSubtitle}>
                  Create your HoneyChain passport. Connect IoT apiary sensors or verify real farm-to-jar origins seamlessly.
                </Text>

                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <ShieldCheck size={22} color="#F4B942" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>Beekeeper Ecosystem</Text>
                      <Text style={styles.featureDesc}>Manage hives, register harvests, and issue verifiable batch passports</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <Sparkles size={22} color="#F4B942" style={styles.featureIcon} />
                    <View style={styles.featureTextGroup}>
                      <Text style={styles.featureTitle}>Consumer Verification</Text>
                      <Text style={styles.featureDesc}>Scan QR codes to inspect laboratory reports & blockchain hashes</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.showcaseFooter}>
                  <Text style={styles.showcaseFooterText}>🐝 Over 10,000+ Verified Batches On-Chain</Text>
                </View>
              </View>
            )}

            {/* Registration Form Card */}
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

                <Text style={[styles.title, { color: colors.text }]}>{t('createAccount', 'Create Account')}</Text>
                <Text style={[styles.subtitle, { color: colors.subtext }]}>{t('joinSubtitle', 'Join the HoneyChain Web3 Ecosystem')}</Text>
              </View>

              {/* Error Box */}
              {globalError ? (
                <View style={[styles.errorBox, { backgroundColor: colors.isDark ? '#371B1B' : '#FEE2E2', borderColor: colors.status.error + '44' }]}>
                  <AlertCircle size={20} color={colors.status.error} style={{ marginRight: 8 }} />
                  <Text style={[styles.errorText, { color: colors.status.error }]}>{globalError}</Text>
                </View>
              ) : null}

              {/* Success Box */}
              {successMsg ? (
                <View style={[styles.successBox, { backgroundColor: colors.isDark ? '#14291F' : '#DCFCE7', borderColor: colors.status.success + '44' }]}>
                  <CheckCircle2 size={20} color={colors.status.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.successText, { color: colors.status.success }]}>{successMsg}</Text>
                </View>
              ) : null}

              {/* Account Type / Role Selector */}
              <Text style={[styles.roleLabel, { color: colors.subtext }]}>Account Type</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity 
                  style={[
                    styles.roleCard, 
                    { backgroundColor: colors.background, borderColor: selectedRole === USER_ROLES.BEEKEEPER ? colors.accent : colors.border },
                    selectedRole === USER_ROLES.BEEKEEPER && styles.roleCardActive
                  ]}
                  onPress={() => setValue('role', USER_ROLES.BEEKEEPER)}
                  accessibilityRole="button"
                  accessibilityLabel="Beekeeper role"
                >
                  <Text style={styles.roleEmoji}>🐝</Text>
                  <View style={styles.roleTextContainer}>
                    <Text style={[
                      styles.roleTitle, 
                      { color: colors.text },
                      selectedRole === USER_ROLES.BEEKEEPER && { color: colors.accent }
                    ]}>
                      Beekeeper
                    </Text>
                    <Text style={[styles.roleDesc, { color: colors.subtext }]}>Apiary & Harvest Producer</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.roleCard, 
                    { backgroundColor: colors.background, borderColor: selectedRole === USER_ROLES.CUSTOMER ? colors.accent : colors.border },
                    selectedRole === USER_ROLES.CUSTOMER && styles.roleCardActive
                  ]}
                  onPress={() => setValue('role', USER_ROLES.CUSTOMER)}
                  accessibilityRole="button"
                  accessibilityLabel="Customer role"
                >
                  <Text style={styles.roleEmoji}>👤</Text>
                  <View style={styles.roleTextContainer}>
                    <Text style={[
                      styles.roleTitle, 
                      { color: colors.text },
                      selectedRole === USER_ROLES.CUSTOMER && { color: colors.accent }
                    ]}>
                      Customer
                    </Text>
                    <Text style={[styles.roleDesc, { color: colors.subtext }]}>Honey Buyer & Verifier</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Form Inputs */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Full Name" 
                    placeholder="John Doe" 
                    leftIcon={<User size={20} color={colors.subtext} />}
                    onBlur={onBlur} 
                    onChangeText={onChange} 
                    value={value ?? ''} 
                    error={errors.name?.message} 
                    accessibilityLabel="Full Name"
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Email Address" 
                    placeholder="you@example.com" 
                    autoCapitalize="none" 
                    keyboardType="email-address" 
                    leftIcon={<Mail size={20} color={colors.subtext} />}
                    onBlur={onBlur} 
                    onChangeText={onChange} 
                    value={value ?? ''} 
                    error={errors.email?.message} 
                    accessibilityLabel="Email Address"
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Phone Number (Optional)" 
                    placeholder="+1 555-0199" 
                    keyboardType="phone-pad" 
                    leftIcon={<Phone size={20} color={colors.subtext} />}
                    onBlur={onBlur} 
                    onChangeText={onChange} 
                    value={value ?? ''} 
                    error={errors.phone?.message} 
                    accessibilityLabel="Phone Number"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
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
                    <PasswordStrengthIndicator password={passwordValue} />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Confirm Password" 
                    placeholder="••••••••" 
                    isPassword={true} 
                    leftIcon={<Lock size={20} color={colors.subtext} />}
                    onBlur={onBlur} 
                    onChangeText={onChange} 
                    value={value ?? ''} 
                    error={errors.confirmPassword?.message} 
                    accessibilityLabel="Confirm Password"
                  />
                )}
              />

              {/* Terms Checkbox */}
              <TouchableOpacity 
                style={styles.termsRow}
                onPress={() => setValue('termsAccepted', !termsAccepted)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: termsAccepted }}
                accessibilityLabel="I agree to Terms & Conditions"
              >
                {termsAccepted ? (
                  <CheckSquare size={20} color={colors.accent} />
                ) : (
                  <Square size={20} color={colors.subtext} />
                )}
                <Text style={[styles.termsText, { color: colors.subtext }]}>
                  I agree to the <Text style={[styles.termsLink, { color: colors.accent }]}>Terms of Service</Text> and <Text style={[styles.termsLink, { color: colors.accent }]}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.termsAccepted?.message ? (
                <Text style={styles.termsErrorText}>{errors.termsAccepted.message}</Text>
              ) : null}

              {/* Submit Button */}
              <View style={styles.submitContainer}>
                <Button 
                  title="Create Account" 
                  onPress={handleSubmit(onSubmit)} 
                  isLoading={isSubmitting} 
                  icon={<ArrowRight size={18} color="#000000" />}
                />
              </View>

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
              
              {/* Footer Login Link */}
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.subtext }]}>Already have an account? </Text>
                <TouchableOpacity 
                  onPress={() => router.replace('/(auth)/login')}
                  accessibilityRole="link"
                  accessibilityLabel="Sign In"
                >
                  <Text style={[styles.footerLink, { color: colors.accent }]}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LanguageModal 
        visible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
      />
    </AuthBackground>
  );
}
