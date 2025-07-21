import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { login, inspectorLogin, driverLogin, fetchProfile } from '../../services/auth';
import { saveToken, saveProfile } from '../../services/storage';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const roles = [
  { label: 'Admin/General User', value: 'admin' },
  { label: 'Inspector', value: 'inspector' },
  { label: 'Driver', value: 'driver' },
];

const nigerianPlateRegex = /^[A-Z]{3}-\d{3}[A-Z]{2}$/;
const nigerianDLRegex = /^[A-Z]{3}\d{8}$/;

export default function LoginScreen() {
  const router = useRouter();
  const rawColorScheme = useColorScheme();
  const colorScheme = rawColorScheme || 'light';
  const [role, setRole] = useState('admin');
  // Admin/General
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Inspector
  const [inspectorUsername, setInspectorUsername] = useState('');
  const [inspectorPassword, setInspectorPassword] = useState('');
  // Driver
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Field validation
    if (role === 'admin' && (!username || !password)) {
      Alert.alert('Missing fields', 'Please enter both username and password.');
      return;
    }
    if (role === 'inspector' && (!inspectorUsername || !inspectorPassword)) {
      Alert.alert('Missing fields', 'Please enter both inspector username and password.');
      return;
    }
    if (role === 'driver' && (!driverName || !driverLicense || !plateNumber || !driverPassword)) {
      Alert.alert('Missing fields', 'Please fill all driver login fields, including password.');
      return;
    }
    if (role === 'driver' && !nigerianPlateRegex.test(plateNumber)) {
      Alert.alert('Invalid Plate Number', 'Plate number must be in the format ABC-123DE.');
      return;
    }
    if (role === 'driver' && !nigerianDLRegex.test(driverLicense)) {
      Alert.alert('Invalid Driver License', 'Driver license must be in the format ABC12345678.');
      return;
    }
    setLoading(true);
    try {
      let data;
      if (role === 'admin') {
        data = await login({ username, password });
      } else if (role === 'inspector') {
        data = await inspectorLogin({ username: inspectorUsername, password: inspectorPassword });
      } else if (role === 'driver') {
        data = await driverLogin({ name: driverName, driverLicense, plateNumber, password: driverPassword });
      }
      console.log('Login response:', data); // Debug log
      if (data && data.data && data.data.token) {
        await saveToken(data.data.token);
        // Fetch and save profile after login
        try {
          const profileResp = await fetchProfile();
          await saveProfile(profileResp.user || profileResp);
        } catch (e) {
          // Ignore profile fetch error for now
        }
        router.replace('/dashboard');
      } else {
        Alert.alert('Login failed', data?.message || 'Unknown error');
      }
    } catch (err: any) {
      console.log('Login error:', err); // Debug log
      if (err.message && err.message.includes('Network Error')) {
        Alert.alert('Network error', 'Could not connect to the server. Please check your connection.');
      } else {
        Alert.alert('Login failed', err.response?.data?.message || err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Image source={require('../../assets/images/icon.png')} style={{ width: 80, height: 54, marginBottom: 16 }} />
        <Text style={[styles.title, { color: '#000' }]}>Login</Text>
        <View style={styles.roleSelector}>
          {roles.map((r) => (
            <Button
              key={r.value}
              title={r.label}
              onPress={() => setRole(r.value)}
              color={role === r.value ? '#000' : Colors[colorScheme].text}
            />
          ))}
        </View>
        {role === 'admin' && (
          <>
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Username"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Password"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </>
        )}
        {role === 'inspector' && (
          <>
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Inspector Username"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={inspectorUsername}
              onChangeText={setInspectorUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Password"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={inspectorPassword}
              onChangeText={setInspectorPassword}
              secureTextEntry
            />
          </>
        )}
        {role === 'driver' && (
          <>
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Name"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={driverName}
              onChangeText={setDriverName}
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Driver License"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={driverLicense}
              onChangeText={setDriverLicense}
              autoCapitalize="characters"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Plate Number"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={plateNumber}
              onChangeText={setPlateNumber}
              autoCapitalize="characters"
            />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].secondary }]}
              placeholder="Password"
              placeholderTextColor={Colors[colorScheme].text + '99'}
              value={driverPassword}
              onChangeText={setDriverPassword}
              secureTextEntry
            />
          </>
        )}
        <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} color={Colors[colorScheme].secondary} />
        <View style={{ height: 16 }} />
        <Button title="Don't have an account? Register" onPress={() => router.push('/auth/register')} color={Colors[colorScheme].secondary} />
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
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
}); 