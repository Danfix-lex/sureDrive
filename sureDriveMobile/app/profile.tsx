import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { getToken } from '../services/storage';
import api from '../services/api';

export default function ProfileScreen() {
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
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Profile & Settings" titleStyle={{ color: '#FF8800', fontWeight: 'bold' }} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator color="#FF8800" />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : user ? (
            <>
              <Text style={styles.info}>Name: {user.name}</Text>
              <Text style={styles.info}>Username: {user.username}</Text>
              <Text style={styles.info}>Phone: {user.phone}</Text>
              <Text style={styles.info}>National ID: {user.nationalId}</Text>
              <Text style={styles.info}>Role: {user.role}</Text>
              <Button mode="contained" style={styles.button} buttonColor="#FF8800" textColor="#fff" onPress={() => {}}>
                Edit Profile (Coming Soon)
              </Button>
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
  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
}); 