import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const colorScheme = useColorScheme() || 'light';
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setRole(profile?.role || null);
      if (profile?.role === 'admin') fetchUsers();
      else setLoading(false);
    })();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://YOUR_BACKEND_IP:5000/api/user');
      const data = await resp.json();
      setUsers(data.data || []);
    } catch (err: any) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (userId: string) => {
    Alert.alert('Verify', `Verify user ${userId}?`);
    // Implement verify API call
  };
  const handleDelete = (userId: string) => {
    Alert.alert('Delete', `Delete user ${userId}?`);
    // Implement delete API call
  };
  const handleEdit = (userId: string) => {
    router.push(`/edit-user/${userId}`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading users...</Text></View>;
  if (role !== 'admin') return <View style={styles.center}><Text style={{ color: 'red' }}>Only admins can view and manage users.</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <FlatList
        data={users}
        keyExtractor={item => item.userId}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name} ({item.role}) {item.isVerified ? '✅' : '❌'}</Text>
            <Text style={styles.info}>Phone: {item.phone}</Text>
            <Text style={styles.info}>National ID: {item.nationalId}</Text>
            <Text style={styles.info}>Language: {item.language}</Text>
            {item.username && <Text style={styles.info}>Username: {item.username}</Text>}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => handleVerify(item.userId)}><Text style={styles.btnText}>Verify</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#D84315' }]} onPress={() => handleDelete(item.userId)}><Text style={styles.btnText}>Delete</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#4F8EF7' }]} onPress={() => handleEdit(item.userId)}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { fontSize: 14, color: '#555', marginBottom: 2 },
  actions: { flexDirection: 'row', marginTop: 10 },
  btn: { backgroundColor: '#43A047', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
}); 