import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProfile } from '../services/auth';
import { deleteToken, getProfile } from '../services/storage';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function DashboardScreen() {
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

  // Example stats (replace with real API calls if available)
  const stats = [
    { label: 'Users', icon: <Ionicons name="people" size={28} color="#fff" />, color: '#4F8EF7', onPress: () => router.push('/users') },
    { label: 'Vehicles', icon: <MaterialIcons name="directions-car" size={28} color="#fff" />, color: '#43A047', onPress: () => router.push('/vehicles') },
    { label: 'Inspections', icon: <FontAwesome5 name="clipboard-check" size={26} color="#fff" />, color: '#F9A825', onPress: () => router.push('/inspections') },
    { label: 'Payments', icon: <MaterialIcons name="payment" size={28} color="#fff" />, color: '#D84315', onPress: () => router.push('/payments') },
    { label: 'Support', icon: <Ionicons name="chatbubbles" size={28} color="#fff" />, color: '#6A1B9A', onPress: () => router.push('/support') },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={require('../assets/images/icon.png')} style={{ width: 60, height: 40, marginBottom: 8 }} />
          <Text style={styles.profileName}>{profile?.name}</Text>
          <Text style={styles.profileRole}>{profile?.role} {profile?.isVerified ? '✅' : '❌'}</Text>
          <Text style={styles.profileInfo}>Phone: {profile?.phone}</Text>
          <Text style={styles.profileInfo}>National ID: {profile?.nationalId}</Text>
          <Text style={styles.profileInfo}>Language: {profile?.language}</Text>
          {profile?.username && <Text style={styles.profileInfo}>Username: {profile?.username}</Text>}
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
              <Ionicons name="person-circle" size={22} color="#fff" />
              <Text style={styles.profileBtnText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.profileBtn, { backgroundColor: '#D84315' }]} onPress={handleLogout}>
              <Ionicons name="log-out" size={22} color="#fff" />
              <Text style={styles.profileBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Model Summary Cards */}
        <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>Quick Access</Text></View>
        <View style={styles.statsRow}>
          {stats.map((item, idx) => (
            <TouchableOpacity key={item.label} style={[styles.statCard, { backgroundColor: item.color }]} onPress={item.onPress}>
              {item.icon}
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add more feature cards/sections here as needed */}
        <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>Actions & Features</Text></View>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• View and manage users, vehicles, inspections, and payments</Text>
          <Text style={styles.featureItem}>• Book inspections and download certificates</Text>
          <Text style={styles.featureItem}>• Report issues and chat with support</Text>
          <Text style={styles.featureItem}>• Edit your profile and change password</Text>
          <Text style={styles.featureItem}>• Role-based access to features</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContainer: { padding: 16, alignItems: 'center' },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileName: { fontSize: 22, fontWeight: 'bold', marginBottom: 2, color: '#222' },
  profileRole: { fontSize: 16, fontWeight: '600', color: '#4F8EF7', marginBottom: 6 },
  profileInfo: { fontSize: 14, color: '#555', marginBottom: 2 },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  profileBtnText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
  sectionHeader: { width: '100%', marginTop: 8, marginBottom: 8 },
  sectionHeaderText: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: 18 },
  statCard: {
    width: 110,
    height: 90,
    borderRadius: 14,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginTop: 8 },
  featureList: { width: '100%', marginTop: 8, marginBottom: 24 },
  featureItem: { fontSize: 15, color: '#444', marginBottom: 6 },
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