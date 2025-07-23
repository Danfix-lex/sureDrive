import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput, Picker } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function BookInspectionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setUserId(profile?.userId || profile?._id || null);
      fetchVehicles(profile?.userId || profile?._id);
    })();
  }, []);

  const fetchVehicles = async (userId: string) => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://YOUR_BACKEND_IP:5000/api/vehicle');
      const data = await resp.json();
      const userVehicles = data.data?.filter((v: any) => v.ownerId === userId) || [];
      setVehicles(userVehicles);
    } catch (err: any) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedVehicle || !date) {
      Alert.alert('Error', 'Please select a vehicle and date.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://YOUR_BACKEND_IP:5000/api/inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: selectedVehicle, date }),
      });
      const data = await resp.json();
      if (data.success) {
        Alert.alert('Success', 'Inspection booked successfully!');
        router.replace('/inspections');
      } else {
        Alert.alert('Booking failed', data?.message || 'Unknown error');
      }
    } catch (err: any) {
      setError('Failed to book inspection');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Text style={styles.title}>Book Inspection</Text>
        <Text style={styles.label}>Select Vehicle:</Text>
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={setSelectedVehicle}
          style={styles.input}
        >
          <Picker.Item label="Select a vehicle" value="" />
          {vehicles.map((v) => (
            <Picker.Item key={v._id} label={v.plateNumber} value={v._id} />
          ))}
        </Picker>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
        <Button title="Book Inspection" onPress={handleBook} color={Colors[colorScheme].secondary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 4 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 