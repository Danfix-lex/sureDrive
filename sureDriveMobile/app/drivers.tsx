import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { getToken } from '../services/storage';

export default function DriversScreen() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme() || 'light';

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const resp = await api.get('/users?role=driver', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(resp.data.data || []);
    } catch (err: any) {
      setError('Failed to load drivers.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string, isVerified: boolean) => {
    // Optimistic UI update
    setDrivers(prevDrivers => prevDrivers.map(d => d.userId === userId ? { ...d, isVerified } : d));
    try {
      const token = await getToken();
      await api.put(`/users/${userId}`, { isVerified }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // No need to refetch, already updated locally
    } catch (err) {
      // Revert on error
      setDrivers(prevDrivers => prevDrivers.map(d => d.userId === userId ? { ...d, isVerified: !isVerified } : d));
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading drivers...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <FlatList
        data={drivers}
        keyExtractor={item => item.userId}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>Phone: {item.phone}</Text>
            <Text style={styles.info}>Driver License: {item.nationalId}</Text>
            <Text style={styles.info}>Plate Number: {item.plateNumber}</Text>
            <Text style={styles.info}>Status: {item.isVerified ? 'Verified' : 'Pending'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#43A047' }]}
                onPress={() => handleVerify(item.userId, true)}
                disabled={item.isVerified}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#D84315', marginLeft: 8 }]}
                onPress={() => handleVerify(item.userId, false)}
                disabled={!item.isVerified}
              >
                <Text style={styles.buttonText}>Unverify</Text>
              </TouchableOpacity>
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
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 