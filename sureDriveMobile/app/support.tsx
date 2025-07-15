import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator, List } from 'react-native-paper';
import { getToken } from '../services/storage';
import api from '../services/api';

export default function SupportScreen() {
  const [issues, setIssues] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        const res = await api.get('/support', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(res.data.data);
      } catch (err: any) {
        setError('Failed to load support issues');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Support" titleStyle={{ color: '#FF8800', fontWeight: 'bold' }} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator color="#FF8800" />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : (
            <FlatList
              data={issues}
              keyExtractor={(item) => item._id || item.issueId}
              renderItem={({ item }) => (
                <List.Item
                  title={item.subject || 'Support Issue'}
                  description={item.message || item.status}
                  left={props => <List.Icon {...props} icon="help-circle" color="#FF8800" />}
                  style={styles.listItem}
                />
              )}
              ListEmptyComponent={<Text style={{ color: '#fff' }}>No support issues found.</Text>}
            />
          )}
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
  listItem: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 8,
  },
}); 