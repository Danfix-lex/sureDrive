import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { driverRegister } from '../../services/auth';
import { saveToken } from '../../services/storage';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function RegisterScreen() {
  const router = useRouter();
  const rawColorScheme = useColorScheme();
  const colorScheme = rawColorScheme || 'light';
  const [fullName, setFullName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverLanguage, setDriverLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const nigerianDLRegex = /^[A-Z]{3}\d{8}$/;
  const nigerianPlateRegex = /^[A-Z]{3}-\d{3}[A-Z]{2}$/;

  const handleRegister = async () => {
    console.log('Register button clicked');
    console.log('Driver fields:', { fullName, driverLicense, plateNumber, driverPhone, driverPassword, driverLanguage });
    const missing = [];
    if (!fullName) missing.push('Full Name');
    if (!driverLicense) missing.push('Driver License');
    if (!plateNumber) missing.push('Plate Number');
    if (!driverPhone) missing.push('Phone');
    if (!driverPassword) missing.push('Password');
    if (missing.length > 0) {
      Alert.alert('Missing fields', 'Please fill: ' + missing.join(', '));
      return;
    }
    if (!nigerianPlateRegex.test(plateNumber)) {
      Alert.alert('Invalid Plate Number', 'Plate number must be in the format ABC-123DE.');
      return;
    }
    if (!nigerianDLRegex.test(driverLicense)) {
      Alert.alert('Invalid Driver License', 'Driver license must be in the format ABC12345678.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(driverPassword)) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    setLoading(true);
    try {
      console.log('Final driverPassword before payload:', driverPassword);
      const payload = { name: fullName, driverLicense, plateNumber, phone: driverPhone, password: driverPassword, language: driverLanguage };
      console.log('Driver registration payload:', payload);
      const data = await driverRegister(payload);
      console.log('Registration API response:', data);
      if (data && data.success) {
        Alert.alert('Registration successful', 'Your account is pending verification. Please login once verified.');
        router.replace('/auth/login');
      } else {
        Alert.alert('Registration failed', data?.message || 'Unknown error');
      }
    } catch (err: any) {
      console.log('Registration error:', err);
      if (err.message && err.message.includes('Network Error')) {
        Alert.alert('Network error', 'Could not connect to the server. Please check your connection.');
      } else {
        Alert.alert('Registration failed', err.response?.data?.message || err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.container}>
        <Image source={require('../../assets/images/icon.png')} style={{ width: 80, height: 54, marginBottom: 16 }} />
        <Text style={[styles.title, { color: '#000' }]}>Register as Driver</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Driver License (e.g. ABC12345678)"
          value={driverLicense}
          onChangeText={setDriverLicense}
          autoCapitalize="characters"
        />
        {driverLicense.length > 0 && (
          <Text style={{ color: nigerianDLRegex.test(driverLicense) ? 'green' : 'red', marginBottom: 8 }}>
            {nigerianDLRegex.test(driverLicense) ? 'Valid driver license format' : 'Invalid format: should be ABC12345678'}
          </Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Plate Number (e.g. ABC-123DE)"
          value={plateNumber}
          onChangeText={setPlateNumber}
          autoCapitalize="characters"
        />
        {plateNumber.length > 0 && (
          <Text style={{ color: nigerianPlateRegex.test(plateNumber) ? 'green' : 'red', marginBottom: 8 }}>
            {nigerianPlateRegex.test(plateNumber) ? 'Valid plate number format' : 'Invalid format: should be ABC-123DE'}
          </Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={driverPhone}
          onChangeText={setDriverPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={driverPassword}
          onChangeText={text => {
            setDriverPassword(text);
            console.log('Password input:', text);
          }}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Language (en)"
          value={driverLanguage}
          onChangeText={setDriverLanguage}
          autoCapitalize="none"
        />
        <Text>Password state: {driverPassword}</Text>
        <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} color={Colors[colorScheme].secondary} />
        <View style={{ height: 16 }} />
        <Button title="Already have an account? Login" onPress={() => router.push('/auth/login')} color={Colors[colorScheme].secondary} />
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
    color: Colors.light.secondary,
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