import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { createInspector } from '../services/admin';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { getProfile } from '../services/storage';

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

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setRole(profile?.role || null);
    })();
  }, []);

  const handleCreateInspector = async () => {
    setLoading(true);
    try {
      await createInspector({ name, username, password, phone, nationalId, language });
      Alert.alert('Success', 'Inspector created');
      setName('');
      setUsername('');
      setPassword('');
      setPhone('');
      setNationalId('');
      setLanguage('en');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to create inspector');
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
        <Text style={[styles.title, { color: adminColor }]}>Create Inspector</Text>
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