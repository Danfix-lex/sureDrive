import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile } from '../../services/storage';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function EditUserScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const colorScheme = useColorScheme() || 'light';
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`http://YOUR_BACKEND_IP:5000/api/user/${userId}`);
      const data = await resp.json();
      setUser(data.data);
    } catch (err: any) {
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const resp = await fetch(`http://YOUR_BACKEND_IP:5000/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await resp.json();
      if (data.success) {
        Alert.alert('Success', 'User updated successfully!');
        router.replace('/users');
      } else {
        Alert.alert('Update failed', data?.message || 'Unknown error');
      }
    } catch (err: any) {
      setError('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading user...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!user) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Text style={styles.title}>Edit User</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={user.name}
          onChangeText={val => setUser({ ...user, name: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={user.phone}
          onChangeText={val => setUser({ ...user, phone: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="National ID"
          value={user.nationalId}
          onChangeText={val => setUser({ ...user, nationalId: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Language"
          value={user.language}
          onChangeText={val => setUser({ ...user, language: val })}
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