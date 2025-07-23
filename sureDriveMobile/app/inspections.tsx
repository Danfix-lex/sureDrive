import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import api from '../services/api';
import * as Print from 'expo-print';
import { Share } from 'react-native';

export default function InspectionsScreen() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [resultInput, setResultInput] = useState('');
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
      const resp = await api.get('/inspections');
      setInspections(resp.data.data || []);
    } catch (err: any) {
      setError('Failed to load inspections. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    router.push('/book-inspection');
  };
  const handleDownload = async (inspection: any) => {
    // Generate a simple HTML certificate
    const html = `
      <html><body>
        <h1>Inspection Certificate</h1>
        <p><b>Inspection ID:</b> ${inspection.inspectionId}</p>
        <p><b>Vehicle:</b> ${inspection.vehicleId}</p>
        <p><b>Inspector:</b> ${inspection.inspectorId}</p>
        <p><b>Result:</b> ${inspection.result}</p>
        <p><b>Date:</b> ${inspection.timestamp}</p>
      </body></html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Share.share({ url: uri, message: 'Inspection Certificate' });
  };

  const openResultModal = (inspection: any) => {
    setSelectedInspection(inspection);
    setResultInput(inspection.result || '');
    setShowResultModal(true);
  };

  const submitResult = async () => {
    if (!selectedInspection) return;
    setLoading(true);
    setError('');
    try {
      const resp = await api.put(`/inspections/${selectedInspection._id}`, { result: resultInput });
      if (resp.data.success) {
        Alert.alert('Success', 'Inspection result updated!');
        setShowResultModal(false);
        fetchInspections();
      } else {
        Alert.alert('Error', resp.data.error || 'Failed to update result');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to update result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading inspections...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{error}</Text></View>;

  // Filter inspections for driver/inspector
  let visibleInspections = inspections;
  if (role === 'driver') visibleInspections = inspections.filter(i => i.ownerId === userId || i.userId === userId);
  if (role === 'inspector') visibleInspections = inspections.filter(i => i.inspectorId === userId);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      {role === 'driver' && <Text style={styles.hint}>You can only see and book your own inspections.</Text>}
      {role === 'inspector' && <Text style={styles.hint}>You can only see inspections assigned to you.</Text>}
      <TouchableOpacity style={styles.bookBtn} onPress={handleBook}><Text style={styles.bookBtnText}>Book Inspection</Text></TouchableOpacity>
      {visibleInspections.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#888', fontSize: 18, fontWeight: 'bold', marginTop: 32 }}>No inspections found.</Text>
          <Text style={{ color: '#888', fontSize: 15, marginTop: 8 }}>You have not booked or been assigned any inspections yet.</Text>
        </View>
      ) : (
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
              <TouchableOpacity style={styles.btn} onPress={() => handleDownload(item)}><Text style={styles.btnText}>Download Certificate</Text></TouchableOpacity>
              {role === 'inspector' && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#43A047' }]} onPress={() => openResultModal(item)}><Text style={styles.btnText}>Submit/Update Result</Text></TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
      {showResultModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Submit/Update Result</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }}
              placeholder="Result (e.g. PASS, FAIL)"
              value={resultInput}
              onChangeText={setResultInput}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#D84315' }]} onPress={() => setShowResultModal(false)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#43A047' }]} onPress={submitResult}><Text style={styles.btnText}>Submit</Text></TouchableOpacity>
            </View>
          </View>
        </View>
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
  btn: { backgroundColor: '#4F8EF7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  bookBtn: { backgroundColor: '#43A047', padding: 12, borderRadius: 8, margin: 16, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#888', fontSize: 14, marginHorizontal: 16, marginBottom: 8 },
}); 