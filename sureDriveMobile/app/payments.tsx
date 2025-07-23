import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import api from '../services/api';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<any[]>([]);
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
      fetchPayments();
    })();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await api.get('/driver/payments');
      setPayments(resp.data.data || []);
    } catch (err: any) {
      setError('Failed to load payments. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = () => {
    router.push('/make-payment');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading payments...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{error}</Text></View>;

  // Filter payments for driver
  const visiblePayments = role === 'driver' ? payments.filter(p => p.ownerId === userId) : payments;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      {role === 'driver' && <Text style={styles.hint}>You can only see your own payments.</Text>}
      {role !== 'admin' && <Text style={styles.hint}>Only admins can see all payments.</Text>}
      <TouchableOpacity style={styles.payBtn} onPress={handleMakePayment}><Text style={styles.payBtnText}>Make Payment</Text></TouchableOpacity>
      {visiblePayments.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#888', fontSize: 18, fontWeight: 'bold', marginTop: 32 }}>No payments found.</Text>
          <Text style={{ color: '#888', fontSize: 15, marginTop: 8 }}>You have not made any payments yet.</Text>
        </View>
      ) : (
        <FlatList
          data={visiblePayments}
          keyExtractor={item => item.paymentId || item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>Payment: {item.paymentId}</Text>
              <Text style={styles.info}>Plate: {item.plateNumber}</Text>
              <Text style={styles.info}>Type: {item.type}</Text>
              <Text style={styles.info}>Amount: ₦{item.amount}</Text>
              <Text style={styles.info}>Date: {item.timestamp}</Text>
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
  payBtn: { backgroundColor: '#43A047', padding: 12, borderRadius: 8, margin: 16, alignItems: 'center' },
  payBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#888', fontSize: 14, marginHorizontal: 16, marginBottom: 8 },
}); 