import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, Clipboard, Modal, Pressable } from 'react-native';
import { createInspector } from '../services/admin';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { getProfile } from '../services/storage';

function generateRandomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AdminScreen() {
  const rawColorScheme = useColorScheme();
  const colorScheme = rawColorScheme || 'light';
  const adminColor = colorScheme === 'dark' ? '#536dfe' : '#3d5afe';
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [createdInspector, setCreatedInspector] = useState<{ username: string; password: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setRole(profile?.role || null);
      console.log('Current role:', profile?.role); // Debug log
    })();
  }, []);

  const handleCreateInspector = async () => {
    if (!name || !username || !password || !phone || !nationalId) {
      Alert.alert('Missing fields', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await createInspector({ name, username, password, phone, nationalId, language });
      setCreatedInspector({ username, password });
      setShowModal(true);
      setName('');
      setUsername('');
      setPassword('');
      setPhone('');
      setNationalId('');
      setLanguage('en');
    } catch (err: any) {
      console.log('Create Inspector Error:', err, err.response?.data);
      Alert.alert('Error', err.response?.data?.message || err.response?.data?.error || err.message || JSON.stringify(err) || 'Failed to create inspector');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'admin') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
        <View style={styles.container}>
          <Text style={[styles.title, { color: 'red' }]}>Access Denied</Text>
          <Text style={{ color: Colors[colorScheme].text }}>You do not have permission to view this page.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Image source={require('../assets/images/icon.png')} style={{ width: 80, height: 54, marginBottom: 16 }} />
        <Text style={[styles.title, { color: adminColor }]}>Admin Panel</Text>
        {role === 'admin' && (
          <Button
            title="Generate Inspector Login"
            color={adminColor}
            onPress={() => setShowForm(true)}
          />
        )}
        {showForm && (
          <>
            <Text style={[styles.title, { color: adminColor, fontSize: 22 }]}>Create Inspector</Text>
            <Button
              title="Generate Random Credentials"
              color={adminColor}
              onPress={() => {
                setUsername('insp_' + generateRandomString(5));
                setPassword(generateRandomString(10));
              }}
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: adminColor }]}
              placeholder="Name"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: adminColor }]}
              placeholder="Username"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: adminColor }]}
              placeholder="Password"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: adminColor }]}
              placeholder="Phone"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: adminColor }]}
              placeholder="National ID"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={nationalId}
              onChangeText={setNationalId}
              autoCapitalize="characters"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: adminColor }]}
              placeholder="Language (en)"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={language}
              onChangeText={setLanguage}
              autoCapitalize="none"
            />
            <Button title={loading ? 'Creating...' : 'Create Inspector'} onPress={handleCreateInspector} color={adminColor} />
            <Button title="Cancel" color="#888" onPress={() => setShowForm(false)} />
          </>
        )}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0008' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', width: 300 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: adminColor }}>Inspector Created!</Text>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>Username: <Text style={{ fontWeight: 'bold' }}>{createdInspector?.username}</Text></Text>
              <Text style={{ fontSize: 16, marginBottom: 16 }}>Password: <Text style={{ fontWeight: 'bold' }}>{createdInspector?.password}</Text></Text>
              <Pressable
                style={{ backgroundColor: adminColor, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 8 }}
                onPress={() => {
                  Clipboard.setString(`Username: ${createdInspector?.username}\nPassword: ${createdInspector?.password}`);
                  Alert.alert('Copied!', 'Inspector credentials copied to clipboard.');
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Copy Credentials</Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor: '#888', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 }}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    letterSpacing: 1.5,
    textShadowColor: Colors.light.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: Colors.light.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
}); 