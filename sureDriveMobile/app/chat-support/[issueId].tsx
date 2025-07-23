import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile } from '../../services/storage';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function ChatSupportScreen() {
  const router = useRouter();
  const { issueId } = useLocalSearchParams();
  const colorScheme = useColorScheme() || 'light';
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [sender, setSender] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`http://YOUR_BACKEND_IP:5000/api/support/${issueId}/messages`);
      const data = await resp.json();
      setMessages(data.data || []);
    } catch (err: any) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage || !plateNumber || !sender) return;
    setSending(true);
    setError('');
    try {
      const resp = await fetch('http://192.168.137.1:5000/driver/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber, message: newMessage, sender }),
      });
      const data = await resp.json();
      if (data.success) {
        setNewMessage('');
        // Optionally, fetch messages again or append
        fetchMessages();
      } else {
        Alert.alert('Send failed', data?.error || data?.message || 'Unknown error');
      }
    } catch (err: any) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading chat...</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Text style={styles.title}>Support Chat</Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.messageBubble}>
              <Text style={styles.messageSender}>{item.senderName || 'User'}:</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
          style={styles.chatList}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Plate Number"
            value={plateNumber}
            onChangeText={setPlateNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Name or ID"
            value={sender}
            onChangeText={setSender}
          />
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Send" onPress={handleSend} disabled={sending} color={Colors[colorScheme].secondary} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  chatList: { flex: 1, marginBottom: 12 },
  messageBubble: { backgroundColor: '#eee', borderRadius: 8, padding: 8, marginBottom: 8 },
  messageSender: { fontWeight: 'bold' },
  messageText: { fontSize: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 