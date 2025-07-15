import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, HelperText, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { login } from '../../services/auth';
import DanfoLogo from '../../components/DanfoLogo';

export default function LoginScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <DanfoLogo />
      <Card style={styles.card}>
        <Card.Title title="Login" titleStyle={{ color: '#FF8800', fontWeight: 'bold' }} />
        <Card.Content>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#333"
            theme={{ colors: { placeholder: '#333', text: '#000', primary: '#FF8800' } }}
          />
          {error ? <HelperText type="error" visible>{error}</HelperText> : null}
          <Button mode="contained" style={styles.button} onPress={handleLogin} loading={loading} disabled={loading} buttonColor="#FF8800" textColor="#fff">
            Login
          </Button>
          <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.linkContainer}>
            <Text style={styles.linkText}>Don't have an account? <Text style={{ color: '#FF8800', fontWeight: 'bold' }}>Register</Text></Text>
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
}); 