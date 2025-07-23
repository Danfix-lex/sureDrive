import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
    { label: 'Vehicles', icon: <MaterialIcons name="directions-car" size={28} color="#fff" />, color: '#43A047', onPress: async () => { try { router.push('/vehicles'); } catch (e) { Alert.alert('Navigation Error', 'Could not open Vehicles.'); } } },
    { label: 'Inspections', icon: <FontAwesome5 name="clipboard-check" size={26} color="#fff" />, color: '#F9A825', onPress: async () => { try { router.push('/inspections'); } catch (e) { Alert.alert('Navigation Error', 'Could not open Inspections.'); } } },
    { label: 'Payments', icon: <MaterialIcons name="payment" size={28} color="#fff" />, color: '#D84315', onPress: async () => { try { router.push('/payments'); } catch (e) { Alert.alert('Navigation Error', 'Could not open Payments.'); } } },
    { label: 'Support', icon: <Ionicons name="chatbubbles" size={28} color="#fff" />, color: '#6A1B9A', onPress: async () => { try { router.push('/support'); } catch (e) { Alert.alert('Navigation Error', 'Could not open Support.'); } } },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={require('../assets/images/icon.png')} style={{ width: 60, height: 40, marginBottom: 8 }} />
          <Text style={styles.profileName}>{profile?.role === 'admin' ? 'Admin' : profile?.name}</Text>
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
        {profile?.role === 'admin' && (
          <TouchableOpacity
            style={{ backgroundColor: '#3d5afe', borderRadius: 8, padding: 12, marginBottom: 18, alignItems: 'center' }}
            onPress={() => router.push('/admin')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Create Inspector</Text>
          </TouchableOpacity>
        )}
        {/* Role-Based Quick Access and Actions */}
        {profile?.role === 'admin' ? (
          <>
            <View style={styles.statsRow}>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#43A047' }]} onPress={() => router.push('/vehicles')}>
                <MaterialIcons name="directions-car" size={28} color="#fff" />
                <Text style={styles.statLabel}>Vehicles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#F9A825' }]} onPress={() => router.push('/inspections')}>
                <FontAwesome5 name="clipboard-check" size={26} color="#fff" />
                <Text style={styles.statLabel}>Inspections</Text>
              </TouchableOpacity>
              {/* Remove Inspectors and Drivers navigation for now */}
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#3d5afe' }]} onPress={() => router.push('/inspectors')}>
                <Ionicons name="people" size={28} color="#fff" />
                <Text style={styles.statLabel}>Inspectors</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#8e24aa' }]} onPress={() => router.push('/drivers')}>
                <Ionicons name="person" size={28} color="#fff" />
                <Text style={styles.statLabel}>Drivers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#D84315' }]} onPress={() => router.push('/payments')}>
                <MaterialIcons name="payment" size={28} color="#fff" />
                <Text style={styles.statLabel}>Payments</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#6A1B9A' }]} onPress={() => router.push('/support')}>
                <Ionicons name="chatbubbles" size={28} color="#fff" />
                <Text style={styles.statLabel}>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#ff9800' }]} onPress={() => router.push('/report-issue')}>
                <Ionicons name="alert-circle" size={28} color="#fff" />
                <Text style={styles.statLabel}>Report Issues</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#43A047' }]} onPress={() => router.push('/book-inspection')}>
                <MaterialIcons name="event-available" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>Book Inspection</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : profile?.role === 'inspector' ? (
          <>
            <View style={styles.statsRow}>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#43A047' }]} onPress={() => router.push('/vehicles')}>
                <MaterialIcons name="directions-car" size={28} color="#fff" />
                <Text style={styles.statLabel}>Vehicles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statCard, { backgroundColor: '#F9A825' }]} onPress={() => router.push('/inspections')}>
                <FontAwesome5 name="clipboard-check" size={26} color="#fff" />
                <Text style={styles.statLabel}>Inspections</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#43A047' }]} onPress={() => router.push('/inspections')}>
                <FontAwesome5 name="clipboard-check" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>Inspect/Validate</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
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
  actionButtonsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: 18 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 6,
    minWidth: 150,
    justifyContent: 'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 15 },
}); 