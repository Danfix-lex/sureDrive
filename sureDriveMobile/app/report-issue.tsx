import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function ReportIssueScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const [plateNumber, setPlateNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReport = async () => {
    if (!plateNumber || !message) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://192.168.137.1:5000/driver/support/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber, message }),
      });
      const data = await resp.json();
      if (data.success) {
        Alert.alert('Success', 'Issue reported successfully!');
        router.replace('/support');
      } else {
        Alert.alert('Report failed', data?.error || data?.message || 'Unknown error');
      }
    } catch (err: any) {
      setError('Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Submitting...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Text style={styles.title}>Report Issue</Text>
        <TextInput
          style={styles.input}
          placeholder="Plate Number"
          value={plateNumber}
          onChangeText={setPlateNumber}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button title="Report Issue" onPress={handleReport} color={Colors[colorScheme].secondary} />
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