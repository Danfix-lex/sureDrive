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
          console.log('Loaded profile from storage:', storedProfile);
        } else {
          const data = await fetchProfile();
          setProfile(data.user || data);
          console.log('Loaded profile from API:', data.user || data);
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
        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Failed to load profile</Text>
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Image source={require('../assets/images/icon.png')} style={{ width: 80, height: 54, marginBottom: 16 }} />
        <Text style={[styles.title, { color: Colors[colorScheme].secondary }]}>Profile</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Name: <Text style={styles.infoValue}>{profile?.role === 'admin' ? 'Admin' : (profile?.name || 'N/A')}</Text></Text>
          <Text style={styles.infoLabel}>Phone Number: <Text style={styles.infoValue}>{profile?.phone || 'N/A'}</Text></Text>
          <Text style={styles.infoLabel}>National ID: <Text style={styles.infoValue}>{profile?.nationalId || 'N/A'}</Text></Text>
          <Text style={styles.infoLabel}>Role: <Text style={styles.infoValue}>{profile?.role || 'N/A'}</Text></Text>
          <Text style={styles.infoLabel}>Preferred Language: <Text style={styles.infoValue}>{profile?.language || 'N/A'}</Text></Text>
          {profile?.username && <Text style={styles.infoLabel}>Username: <Text style={styles.infoValue}>{profile?.username}</Text></Text>}
          <Text style={styles.infoLabel}>Verified: <Text style={styles.infoValue}>{profile?.isVerified ? 'Yes' : 'No'}</Text></Text>
        </View>
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
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, width: '100%' },
  infoLabel: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#222' },
  infoValue: { fontWeight: 'normal', color: '#333' },
}); 