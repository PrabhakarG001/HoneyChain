import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const inMemoryStore = new Map();

export const setItemAsync = async (key, value) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (e) {
      inMemoryStore.set(key, value);
      return;
    }
  }

  try {
    const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvailable && SecureStore.setItemAsync) {
      await SecureStore.setItemAsync(key, value);
    } else {
      inMemoryStore.set(key, value);
    }
  } catch (err) {
    inMemoryStore.set(key, value);
  }
};

export const getItemAsync = async (key) => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return inMemoryStore.get(key) || null;
    }
  }

  try {
    const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvailable && SecureStore.getItemAsync) {
      return await SecureStore.getItemAsync(key);
    } else {
      return inMemoryStore.get(key) || null;
    }
  } catch (err) {
    return inMemoryStore.get(key) || null;
  }
};

export const deleteItemAsync = async (key) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
      return;
    } catch (e) {
      inMemoryStore.delete(key);
      return;
    }
  }

  try {
    const isAvailable = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvailable && SecureStore.deleteItemAsync) {
      await SecureStore.deleteItemAsync(key);
    } else {
      inMemoryStore.delete(key);
    }
  } catch (err) {
    inMemoryStore.delete(key);
  }
};
