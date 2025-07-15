import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { getToken } from '../services/storage';
import api from '../services/api';

export default function DashboardScreen() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (err: any) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Dashboard" titleStyle={{ color: '#FF8800', fontWeight: 'bold' }} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator color="#FF8800" />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : user ? (
            <>
              <Text style={styles.welcome}>Welcome, {user.name}!</Text>
              <Text style={styles.info}>Role: {user.role}</Text>
              <Text style={styles.info}>Phone: {user.phone}</Text>
              <Text style={styles.info}>National ID: {user.nationalId}</Text>
            </>
          ) : null}
        </Card.Content>
      </Card>
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
  welcome: {
    color: '#FF8800',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
}); 