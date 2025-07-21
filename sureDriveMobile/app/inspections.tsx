import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';

export default function InspectionsScreen() {
  const [inspections, setInspections] = useState<any[]>([]);
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
      fetchInspections();
    })();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://YOUR_BACKEND_IP:5000/api/inspection');
      const data = await resp.json();
      setInspections(data.data || []);
    } catch (err: any) {
      setError('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    router.push('/book-inspection');
  };
  const handleDownload = (inspectionId: string) => {
    Alert.alert('Download', `Download certificate for inspection ${inspectionId}?`);
    // Implement download logic
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading inspections...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  // Filter inspections for driver/inspector
  let visibleInspections = inspections;
  if (role === 'driver') visibleInspections = inspections.filter(i => i.ownerId === userId || i.userId === userId);
  if (role === 'inspector') visibleInspections = inspections.filter(i => i.inspectorId === userId);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      {role === 'driver' && <Text style={styles.hint}>You can only see and book your own inspections.</Text>}
      {role === 'inspector' && <Text style={styles.hint}>You can only see inspections assigned to you.</Text>}
      <TouchableOpacity style={styles.bookBtn} onPress={handleBook}><Text style={styles.bookBtnText}>Book Inspection</Text></TouchableOpacity>
      <FlatList
        data={visibleInspections}
        keyExtractor={item => item.inspectionId || item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>Inspection: {item.inspectionId}</Text>
            <Text style={styles.info}>Vehicle: {item.vehicleId}</Text>
            <Text style={styles.info}>Inspector: {item.inspectorId}</Text>
            <Text style={styles.info}>Result: {item.result}</Text>
            <Text style={styles.info}>Date: {item.timestamp}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => handleDownload(item.inspectionId)}><Text style={styles.btnText}>Download Certificate</Text></TouchableOpacity>
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
  btn: { backgroundColor: '#4F8EF7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  bookBtn: { backgroundColor: '#43A047', padding: 12, borderRadius: 8, margin: 16, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#888', fontSize: 14, marginHorizontal: 16, marginBottom: 8 },
}); 