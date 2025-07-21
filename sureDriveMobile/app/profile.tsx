import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProfile } from '../services/auth';
import { deleteToken, getProfile } from '../services/storage';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const rawColorScheme = useColorScheme();
  const colorScheme = rawColorScheme || 'light';

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        // Try to load from storage first
        let storedProfile = await getProfile();
        if (storedProfile) {
          setProfile(storedProfile);
        } else {
        const data = await fetchProfile();
        setProfile(data.user || data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await deleteToken();
    router.replace('/Welcome');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
    <View style={styles.container}>
        <Image source={require('../assets/images/icon.png')} style={{ width: 80, height: 54, marginBottom: 16 }} />
        <Text style={[styles.title, { color: Colors[colorScheme].secondary }]}>Profile</Text>
      <Text style={styles.label}>User ID: {profile?.userId}</Text>
      <Text style={styles.label}>Name: {profile?.name}</Text>
      <Text style={styles.label}>Phone: {profile?.phone}</Text>
      <Text style={styles.label}>National ID: {profile?.nationalId}</Text>
      <Text style={styles.label}>Role: {profile?.role}</Text>
      <Text style={styles.label}>Language: {profile?.language}</Text>
      <Text style={styles.label}>Username: {profile?.username}</Text>
      <Text style={styles.label}>Verified: {profile?.isVerified ? 'Yes' : 'No'}</Text>
      <View style={{ height: 16 }} />
        <Button title="Logout" onPress={handleLogout} color={Colors[colorScheme].secondary} />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.light.secondary,
    letterSpacing: 1.5,
    textShadowColor: Colors.light.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: Colors.light.text,
  },
}); 