import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView, 
  ActivityIndicator, StyleSheet, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Platform 
} from 'react-native';
import { X, Check, Camera, User, AtSign, AlignLeft, AlertCircle } from 'lucide-react-native';
import { theme } from '../../theme';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&auto=format&fit=crop&q=80'
];

export default function EditProfileModal({ isVisible, onClose }) {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [customAvatar, setCustomAvatar] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user && isVisible) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
      setCustomAvatar(user.avatarUrl && !PRESET_AVATARS.includes(user.avatarUrl) ? user.avatarUrl : '');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [user, isVisible]);

  const validateInputs = () => {
    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return false;
    }
    if (!username.trim()) {
      setErrorMessage('Username is required.');
      return false;
    }
    if (username.length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return false;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username.trim())) {
      setErrorMessage('Username can only contain letters, numbers, underscores, dots, and hyphens.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateInputs()) return;

    const finalAvatar = isCustomMode && customAvatar.trim() ? customAvatar.trim() : avatarUrl;

    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatarUrl: finalAvatar
      });

      updateUser({
        name: updatedUser.name,
        username: updatedUser.username,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
        email: updatedUser.email
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 600);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <X size={22} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>

                {/* Body Form */}
                <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                  
                  {/* Messages */}
                  {errorMessage ? (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={18} color={theme.colors.status.error} />
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                  ) : null}

                  {successMessage ? (
                    <View style={styles.successContainer}>
                      <Check size={18} color={theme.colors.status.success} />
                      <Text style={styles.successText}>{successMessage}</Text>
                    </View>
                  ) : null}

                  {/* Avatar Picker */}
                  <Text style={styles.label}>Profile Picture</Text>
                  <View style={styles.avatarPreviewRow}>
                    {avatarUrl ? (
                      <Image source={{ uri: isCustomMode && customAvatar ? customAvatar : avatarUrl }} style={styles.currentAvatar} />
                    ) : (
                      <View style={[styles.currentAvatar, styles.avatarPlaceholder]}>
                        <User size={36} color={theme.colors.charcoal} />
                      </View>
                    )}
                    <View style={styles.avatarInfo}>
                      <Text style={styles.avatarHint}>Select an avatar below or provide a custom image URL.</Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                    {PRESET_AVATARS.map((url, idx) => {
                      const isSelected = !isCustomMode && avatarUrl === url;
                      return (
                        <TouchableOpacity
                          key={idx}
                          style={[styles.presetItem, isSelected && styles.presetSelected]}
                          onPress={() => {
                            setAvatarUrl(url);
                            setIsCustomMode(false);
                          }}
                        >
                          <Image source={{ uri: url }} style={styles.presetImage} />
                          {isSelected && (
                            <View style={styles.checkBadge}>
                              <Check size={12} color="#FFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* Custom URL Input Toggle */}
                  <TouchableOpacity 
                    style={styles.toggleCustomBtn} 
                    onPress={() => setIsCustomMode(!isCustomMode)}
                  >
                    <Camera size={16} color={theme.colors.primaryDark} />
                    <Text style={styles.toggleCustomText}>
                      {isCustomMode ? 'Use Preset Avatars' : 'Use Custom Image URL'}
                    </Text>
                  </TouchableOpacity>

                  {isCustomMode && (
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="https://example.com/photo.jpg"
                        placeholderTextColor={theme.colors.text.muted}
                        value={customAvatar}
                        onChangeText={(txt) => {
                          setCustomAvatar(txt);
                          setAvatarUrl(txt);
                        }}
                        autoCapitalize="none"
                      />
                    </View>
                  )}

                  {/* Full Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                      <User size={18} color={theme.colors.text.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Enter your full name"
                        placeholderTextColor={theme.colors.text.muted}
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                  </View>

                  {/* Username Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputWrapper}>
                      <AtSign size={18} color={theme.colors.text.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputWithIcon}
                        placeholder="username"
                        placeholderTextColor={theme.colors.text.muted}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  {/* Bio Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 10 }]}>
                      <AlignLeft size={18} color={theme.colors.text.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.inputWithIcon, { height: 75, textAlignVertical: 'top' }]}
                        placeholder="Tell the community about your beekeeping or honey passion..."
                        placeholderTextColor={theme.colors.text.muted}
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </View>

                </ScrollView>

                {/* Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isLoading}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color={theme.colors.charcoal} />
                    ) : (
                      <Text style={styles.saveText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    backgroundColor: theme.colors.background.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.background.main,
  },
  formScroll: {
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.status.error,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 13,
    color: theme.colors.status.success,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  avatarPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  currentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  avatarHint: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  presetScroll: {
    marginBottom: 12,
  },
  presetItem: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 24,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetSelected: {
    borderColor: theme.colors.primary,
  },
  presetImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  checkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: theme.colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  toggleCustomText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.main,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  input: {
    height: 46,
    backgroundColor: theme.colors.background.main,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.background.main,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.charcoal,
  },
});
