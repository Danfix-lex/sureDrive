import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, HelperText, Snackbar, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { register } from '../../services/auth';
import DanfoLogo from '../../components/DanfoLogo';

const ROLES = [
  { label: 'Driver', value: 'driver' },
  { label: 'Admin', value: 'admin' },
  { label: 'Inspector', value: 'inspector' },
];

export default function RegisterScreen() {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [nationalId, setNationalId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [role, setRole] = React.useState('driver');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Validate required fields
    if (!name || !phone || !nationalId || !username || !password || !confirmPassword) {
      setError('All fields are required');
      setSnackbarVisible(true);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSnackbarVisible(true);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setSnackbarVisible(true);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await register({ name, phone, nationalId, password, role, username });
      router.replace('/dashboard');
    } catch (err: any) {
      console.log('Registration error:', err);
      const errorMessage = err?.response?.data?.error || err?.message || 'Registration failed';
      setError(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <DanfoLogo />
      <Card style={styles.card}>
        <Card.Title title="Register" titleStyle={{ color: '#FF8800', fontWeight: 'bold' }} />
        <Card.Content>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          <TextInput
            label="National ID"
            value={nationalId}
            onChangeText={setNationalId}
            style={styles.input}
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          <Text style={styles.roleLabel}>Select Role:</Text>
          <RadioButton.Group onValueChange={setRole} value={role}>
            {ROLES.map(r => (
              <View key={r.value} style={styles.radioRow}>
                <RadioButton value={r.value} color="#FF8800" />
                <Text style={styles.radioLabel}>{r.label}</Text>
              </View>
            ))}
          </RadioButton.Group>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          {error ? <HelperText type="error" visible>{error}</HelperText> : null}
          <Button mode="contained" style={styles.button} onPress={handleRegister} loading={loading} disabled={loading} buttonColor="#FF8800" textColor="#fff">
            Register
          </Button>
          <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? <Text style={{ color: '#FF8800', fontWeight: 'bold' }}>Login</Text></Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#FF8800' }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: '90%',
    paddingVertical: 20,
    backgroundColor: '#111',
    borderRadius: 16,
    elevation: 6,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 15,
  },
  roleLabel: {
    color: '#FF8800',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
}); 