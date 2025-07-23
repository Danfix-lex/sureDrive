import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import api from '../services/api';

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const colorScheme = useColorScheme() || 'light';
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setRole(profile?.role || null);
      setUserId(profile?.userId || profile?._id || null);
      fetchVehicles();
    })();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await api.get('/vehicles');
      setVehicles(resp.data.data || []);
    } catch (err: any) {
      setError('Failed to load vehicles. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (vehicleId: string) => {
    Alert.alert('Verify', `Verify vehicle ${vehicleId}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: async () => {
        setLoading(true);
        setError('');
        try {
          const resp = await api.put(`/vehicles/${vehicleId}/verify`);
          if (resp.data.success) {
            Alert.alert('Success', 'Vehicle verified successfully!');
            fetchVehicles();
          } else {
            Alert.alert('Error', resp.data.error || 'Failed to verify vehicle');
          }
        } catch (err: any) {
          Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to verify vehicle');
        } finally {
          setLoading(false);
        }
      }}
    ]);
  };
  const handleUpdate = (vehicleId: string) => {
    router.push(`/edit-vehicle/${vehicleId}`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading vehicles...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{error}</Text></View>;

  // Filter vehicles for driver
  const visibleVehicles = role === 'driver' ? vehicles.filter(v => v.ownerId === userId) : vehicles;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      {role === 'driver' && <Text style={styles.hint}>You can only see your own vehicles.</Text>}
      {role !== 'admin' && role !== 'inspector' && <Text style={styles.hint}>Only admins and inspectors can verify or update all vehicles.</Text>}
      {visibleVehicles.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#888', fontSize: 18, fontWeight: 'bold', marginTop: 32 }}>No vehicles found.</Text>
          <Text style={{ color: '#888', fontSize: 15, marginTop: 8 }}>You have not added any vehicles yet or none are available for your role.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleVehicles}
          keyExtractor={item => item.vehicleId || item.plateNumber}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.plateNumber} {item.isVerified ? '✅' : '❌'}</Text>
              <Text style={styles.info}>Model: {item.vehicleModel}</Text>
              <Text style={styles.info}>Make: {item.make}</Text>
              <Text style={styles.info}>Owner: {item.ownerId}</Text>
              {(role === 'admin' || role === 'inspector') && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.btn} onPress={() => handleVerify(item.vehicleId)}><Text style={styles.btnText}>Verify</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: '#4F8EF7' }]} onPress={() => handleUpdate(item.vehicleId)}><Text style={styles.btnText}>Update</Text></TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
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
  hint: { color: '#888', fontSize: 14, marginHorizontal: 16, marginBottom: 8 },
}); 