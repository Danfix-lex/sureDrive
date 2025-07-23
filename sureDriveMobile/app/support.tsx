import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getProfile } from '../services/storage';
import api from '../services/api';

export default function SupportScreen() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const colorScheme = useColorScheme() || 'light';
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setRole(profile?.role || null);
      fetchIssues();
    })();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await api.get('/driver/support/issues');
      setIssues(resp.data.data || []);
    } catch (err: any) {
      setError('Failed to load support issues. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    router.push('/report-issue');
  };
  const handleChat = (issueId: string) => {
    router.push(`/chat-support/${issueId}`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading support issues...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <Text style={styles.hint}>All users can report issues and chat with support.</Text>
      <TouchableOpacity style={styles.reportBtn} onPress={handleReport}><Text style={styles.reportBtnText}>Report Issue</Text></TouchableOpacity>
      {issues.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#888', fontSize: 18, fontWeight: 'bold', marginTop: 32 }}>No support issues found.</Text>
          <Text style={{ color: '#888', fontSize: 15, marginTop: 8 }}>You have not reported any issues yet.</Text>
        </View>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={item => item._id || item.issueId}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>Issue: {item.issueId || item._id}</Text>
              <Text style={styles.info}>Plate: {item.plateNumber}</Text>
              <Text style={styles.info}>Status: {item.status}</Text>
              <Text style={styles.info}>Message: {item.message}</Text>
              <TouchableOpacity style={styles.btn} onPress={() => handleChat(item.issueId || item._id)}><Text style={styles.btnText}>Chat</Text></TouchableOpacity>
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
  btn: { backgroundColor: '#4F8EF7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  reportBtn: { backgroundColor: '#43A047', padding: 12, borderRadius: 8, margin: 16, alignItems: 'center' },
  reportBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#888', fontSize: 14, marginHorizontal: 16, marginBottom: 8 },
}); 