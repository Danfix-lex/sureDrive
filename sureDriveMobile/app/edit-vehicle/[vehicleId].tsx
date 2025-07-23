import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile } from '../../services/storage';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function EditVehicleScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams();
  const colorScheme = useColorScheme() || 'light';
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`http://YOUR_BACKEND_IP:5000/api/vehicle/${vehicleId}`);
      const data = await resp.json();
      setVehicle(data.data);
    } catch (err: any) {
      setError('Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vehicle) return;
    setSaving(true);
    setError('');
    try {
      const resp = await fetch(`http://YOUR_BACKEND_IP:5000/api/vehicle/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle),
      });
      const data = await resp.json();
      if (data.success) {
        Alert.alert('Success', 'Vehicle updated successfully!');
        router.replace('/vehicles');
      } else {
        Alert.alert('Update failed', data?.message || 'Unknown error');
      }
    } catch (err: any) {
      setError('Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading vehicle...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!vehicle) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Vehicle</Text>
        <TextInput
          style={styles.input}
          placeholder="Plate Number"
          value={vehicle.plateNumber}
          onChangeText={val => setVehicle({ ...vehicle, plateNumber: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Model"
          value={vehicle.model}
          onChangeText={val => setVehicle({ ...vehicle, model: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={vehicle.color}
          onChangeText={val => setVehicle({ ...vehicle, color: val })}
        />
        <Button title="Save" onPress={handleSave} disabled={saving} color={Colors[colorScheme].secondary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 