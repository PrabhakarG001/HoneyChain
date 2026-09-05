import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView, 
  ActivityIndicator, StyleSheet, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Platform 
} from 'react-native';
import { X, Check, Camera, User, AtSign, AlignLeft, AlertCircle } from 'lucide-react-native';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';
import { useThemeColors } from '../../hooks/useThemeColors';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&auto=format&fit=crop&q=80'
];

export default function EditProfileModal({ isVisible, onClose }) {
  const { user, updateUser } = useAuthStore();
  const colors = useThemeColors();

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
      const userPhoto = user.avatarUrl || user.photoURL || user.avatar_url || user.profileImage || '';
      setAvatarUrl(userPhoto);
      setCustomAvatar(userPhoto && !PRESET_AVATARS.includes(userPhoto) ? userPhoto : '');
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
              <View style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
                  <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
                    <X size={22} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Body Form */}
                <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                  
                  {/* Messages */}
                  {errorMessage ? (
                    <View style={[styles.errorContainer, { backgroundColor: colors.isDark ? '#3F1D1D' : '#FEE2E2' }]}>
                      <AlertCircle size={18} color={colors.status.error} />
                      <Text style={[styles.errorText, { color: colors.status.error }]}>{errorMessage}</Text>
                    </View>
                  ) : null}

                  {successMessage ? (
                    <View style={[styles.successContainer, { backgroundColor: colors.isDark ? '#1C3829' : '#D1FAE5' }]}>
                      <Check size={18} color={colors.accent} />
                      <Text style={[styles.successText, { color: colors.accent }]}>{successMessage}</Text>
                    </View>
                  ) : null}

                  {/* Avatar Picker */}
                  <Text style={[styles.label, { color: colors.text }]}>Profile Picture</Text>
                  <View style={styles.avatarPreviewRow}>
                    {avatarUrl ? (
                      <Image source={{ uri: isCustomMode && customAvatar ? customAvatar : avatarUrl }} style={styles.currentAvatar} />
                    ) : (
                      <View style={[styles.currentAvatar, styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
                        <User size={36} color="#000000" />
                      </View>
                    )}
                    <View style={styles.avatarInfo}>
                      <Text style={[styles.avatarHint, { color: colors.subtext }]}>Select an avatar below or provide a custom image URL.</Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                    {PRESET_AVATARS.map((url, idx) => {
                      const isSelected = !isCustomMode && avatarUrl === url;
                      return (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.presetItem, 
                            isSelected && { borderColor: colors.accent }
                          ]}
                          onPress={() => {
                            setAvatarUrl(url);
                            setIsCustomMode(false);
                          }}
                        >
                          <Image source={{ uri: url }} style={styles.presetImage} />
                          {isSelected && (
                            <View style={[styles.checkBadge, { backgroundColor: colors.accent }]}>
                              <Check size={12} color="#000000" />
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
                    <Camera size={16} color={colors.accent} />
                    <Text style={[styles.toggleCustomText, { color: colors.accent }]}>
                      {isCustomMode ? 'Use Preset Avatars' : 'Use Custom Image URL'}
                    </Text>
                  </TouchableOpacity>

                  {isCustomMode && (
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        placeholder="https://example.com/photo.jpg"
                        placeholderTextColor={colors.subtext}
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
                    <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <User size={18} color={colors.subtext} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.inputWithIcon, { color: colors.text }]}
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.subtext}
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                  </View>

                  {/* Username Input */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Username</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <AtSign size={18} color={colors.subtext} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.inputWithIcon, { color: colors.text }]}
                        placeholder="username"
                        placeholderTextColor={colors.subtext}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  {/* Bio Input */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border, alignItems: 'flex-start', paddingTop: 10 }]}>
                      <AlignLeft size={18} color={colors.subtext} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.inputWithIcon, { color: colors.text, height: 75, textAlignVertical: 'top' }]}
                        placeholder="Tell the community about your beekeeping or honey passion..."
                        placeholderTextColor={colors.subtext}
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
                  <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surface }]} onPress={onClose} disabled={isLoading}>
                    <Text style={[styles.cancelText, { color: colors.subtext }]}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#000000" />
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
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
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
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  formScroll: {
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 13,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  avatarHint: {
    fontSize: 13,
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
  presetImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  checkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    height: 46,
    fontSize: 15,
  },
  input: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
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
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
});
