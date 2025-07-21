import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const PROFILE_KEY = 'user_profile';

export async function saveToken(token: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Web
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    // Native
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Web
    return window.localStorage.getItem(TOKEN_KEY);
  } else {
    // Native
  return await SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export async function deleteToken() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Web
    window.localStorage.removeItem(TOKEN_KEY);
  } else {
    // Native
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function saveProfile(profile: any) {
  const value = JSON.stringify(profile);
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(PROFILE_KEY, value);
  } else {
    await SecureStore.setItemAsync(PROFILE_KEY, value);
  }
}

export async function getProfile() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const value = window.localStorage.getItem(PROFILE_KEY);
    return value ? JSON.parse(value) : null;
  } else {
    const value = await SecureStore.getItemAsync(PROFILE_KEY);
    return value ? JSON.parse(value) : null;
  }
}

export async function deleteProfile() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(PROFILE_KEY);
  } else {
    await SecureStore.deleteItemAsync(PROFILE_KEY);
  }
} 