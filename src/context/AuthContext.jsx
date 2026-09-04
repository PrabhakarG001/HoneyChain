import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  updateProfile,
  signOut, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuthStore } from '../store/auth.store';
import { setItemAsync, deleteItemAsync } from '../utils/storage';

export const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginWithGoogle: async () => {},
  loginWithPhone: async () => {},
  verifyPhoneCode: async () => {},
  logout: async () => {}
});

export const formatFirebaseError = (error) => {
  if (!error) return 'An unknown error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google Sign-In was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow pop-ups for this site.';
    case 'auth/network-request-failed':
      return 'Something went wrong. Please check your internet connection.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase Authentication in Firebase Console.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/invalid-phone-number':
      return 'Invalid phone number format. Please provide full E.164 format (e.g. +14155552671).';
    case 'auth/invalid-verification-code':
      return 'Invalid SMS verification code. Please check and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in your Firebase Console project settings.';
    case 'auth/invalid-api-key':
    case 'auth/invalid-app-credential':
      return 'Firebase configuration error. Please check your environment variables.';
    default:
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('apiKey') || error.message.includes('config')) {
          return 'Firebase configuration is missing or invalid. Please check your .env setup.';
        }
        return error.message.replace(/^Firebase:\s*/, '');
      }
      return 'Authentication failed. Please try again.';
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  // Helper to sync user record into Firestore 'users' collection asynchronously
  const syncUserToFirestore = (firebaseUser, additionalData = {}) => {
    if (!firebaseUser || !db || !db.app) return;
    // Fire and forget in background so UI is never blocked
    (async () => {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 800));
        const fetchPromise = getDoc(userRef);
        const userSnap = await Promise.race([fetchPromise, timeoutPromise]);

        const existingData = (userSnap && typeof userSnap.exists === 'function' && userSnap.exists()) 
          ? userSnap.data() 
          : {};

        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || additionalData.name || firebaseUser.email?.split('@')[0] || 'HoneyChain User',
          displayName: firebaseUser.displayName || additionalData.name || firebaseUser.email?.split('@')[0] || 'HoneyChain User',
          email: firebaseUser.email || additionalData.email || '',
          phoneNumber: firebaseUser.phoneNumber || additionalData.phone || '',
          photoURL: firebaseUser.photoURL || '',
          avatarUrl: firebaseUser.photoURL || '',
          role: additionalData.role || existingData.role || 'CUSTOMER',
          updatedAt: serverTimestamp(),
        };

        if (!userSnap || typeof userSnap.exists !== 'function' || !userSnap.exists()) {
          userData.createdAt = serverTimestamp();
          await setDoc(userRef, userData);
        } else {
          await updateDoc(userRef, userData);
        }
      } catch (e) {
        console.warn('Firestore user sync warning (non-fatal):', e.message);
      }
    })();
  };

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        
        // Fast local storage role restoration check
        let userRole = 'CUSTOMER';
        try {
          const cachedUser = await getItemAsync('user');
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            if (parsed && parsed.role) userRole = parsed.role;
          }
        } catch (e) {
          // ignore
        }

        const formattedUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'HoneyChain User',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'HoneyChain User',
          email: firebaseUser.email || '',
          phoneNumber: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          avatarUrl: firebaseUser.photoURL || '',
          username: firebaseUser.email ? firebaseUser.email.split('@')[0] : 'user',
          role: userRole
        };

        setUser(formattedUser);
        storeLogin(formattedUser, token);
        await setItemAsync('user', JSON.stringify(formattedUser));
        await setItemAsync('access_token', token);

        // Non-blocking background sync to Firestore
        syncUserToFirestore(firebaseUser);
      } else {
        setUser(null);
        storeLogout();
        await deleteItemAsync('user');
        await deleteItemAsync('access_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      syncUserToFirestore(res.user);
      return res.user;
    } catch (err) {
      throw new Error(formatFirebaseError(err));
    }
  };

  const registerWithEmail = async (email, password, displayName, role = 'CUSTOMER') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(res.user, { displayName });
      }
      syncUserToFirestore(res.user, { name: displayName, role });
      return res.user;
    } catch (err) {
      throw new Error(formatFirebaseError(err));
    }
  };

  const loginWithGoogle = async (selectedRole = 'CUSTOMER') => {
    if (!auth.app.options || !auth.app.options.apiKey) {
      throw new Error('Firebase configuration error. Please verify VITE_FIREBASE_* / EXPO_PUBLIC_FIREBASE_* environment variables in .env file.');
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      
      // Fast background sync
      syncUserToFirestore(result.user, { role: selectedRole });
      return result.user;
    } catch (err) {
      const friendlyMessage = formatFirebaseError(err);
      const customError = new Error(friendlyMessage);
      customError.code = err.code;
      throw customError;
    }
  };

  const loginWithPhone = async (phoneNumber, recaptchaVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (err) {
      throw new Error(formatFirebaseError(err));
    }
  };

  const verifyPhoneCode = async (confirmationResult, code) => {
    try {
      const result = await confirmationResult.confirm(code);
      await syncUserToFirestore(result.user);
      return result.user;
    } catch (err) {
      throw new Error(formatFirebaseError(err));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Firebase signOut error:', e);
    } finally {
      setUser(null);
      await storeLogout();
      await deleteItemAsync('user');
      await deleteItemAsync('access_token');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithEmail, 
      registerWithEmail, 
      loginWithGoogle, 
      loginWithPhone, 
      verifyPhoneCode, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
