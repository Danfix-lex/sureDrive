import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import api from '../services/api';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { getToken } from '../services/storage';

export default function InspectorsScreen() {
  const [inspectors, setInspectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme() || 'light';

  useEffect(() => {
    fetchInspectors();
  }, []);

  const fetchInspectors = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const resp = await api.get('/users?role=inspector', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInspectors(resp.data.data || []);
    } catch (err: any) {
      setError('Failed to load inspectors.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading inspectors...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <FlatList
        data={inspectors}
        keyExtractor={item => item.userId}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>Phone: {item.phone}</Text>
            <Text style={styles.info}>National ID: {item.nationalId}</Text>
            <Text style={styles.info}>Status: {item.isVerified ? 'Verified' : 'Pending'}</Text>
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
}); 