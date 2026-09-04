import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Dynamically retrieves environment variables from process.env or import.meta.env
 * Supporting both VITE_FIREBASE_* and EXPO_PUBLIC_FIREBASE_* keys.
 */
const getEnvVar = (viteKey, expoKey, fallback = '') => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[viteKey] && process.env[viteKey].trim() !== '') return process.env[viteKey].trim();
    if (expoKey && process.env[expoKey] && process.env[expoKey].trim() !== '') return process.env[expoKey].trim();
  }
  return fallback;
};

export const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', 'EXPO_PUBLIC_FIREBASE_API_KEY', 'AIzaSyDJFOj7F7I7-NIqclH4JLBhDZzvqb9_uIU'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'honeychain-40065.firebaseapp.com'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'honeychain-40065'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'honeychain-40065.firebasestorage.app'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '314717495726'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', 'EXPO_PUBLIC_FIREBASE_APP_ID', '1:314717495726:web:d71b1db1dd5c01dbc0a83f'),
};

let appInstance;
try {
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn('Firebase initializeApp warning:', e.message);
  appInstance = getApps()[0];
}

export const auth = getAuth(appInstance);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(appInstance);

export default appInstance;
