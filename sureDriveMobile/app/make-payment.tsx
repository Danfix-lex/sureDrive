import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function MakePaymentScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const [amount, setAmount] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [type, setType] = useState('renewal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!amount || !plateNumber || !type) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://192.168.137.1:5000/driver/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber, type, amount: Number(amount) }),
      });
      const data = await resp.json();
      if (data.success) {
        Alert.alert('Success', 'Payment made successfully!');
        router.replace('/payments');
      } else {
        Alert.alert('Payment failed', data?.error || data?.message || 'Unknown error');
      }
    } catch (err: any) {
      setError('Failed to make payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Processing...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Text style={styles.title}>Make Payment</Text>
        <TextInput
          style={styles.input}
          placeholder="Plate Number"
          value={plateNumber}
          onChangeText={setPlateNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Type (renewal or VIS)"
          value={type}
          onChangeText={setType}
        />
        <Button title="Make Payment" onPress={handlePayment} color={Colors[colorScheme].secondary} />
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