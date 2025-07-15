import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator, List } from 'react-native-paper';
import { getToken } from '../services/storage';
import api from '../services/api';

export default function InspectionScreen() {
  const [inspections, setInspections] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        const res = await api.get('/inspections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInspections(res.data.data);
      } catch (err: any) {
        setError('Failed to load inspections');
      } finally {
        setLoading(false);
      }
    };
    fetchInspections();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Inspections" titleStyle={{ color: '#FF8800', fontWeight: 'bold' }} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator color="#FF8800" />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : (
            <FlatList
              data={inspections}
              keyExtractor={(item) => item._id || item.plateNumber}
              renderItem={({ item }) => (
                <List.Item
                  title={item.plateNumber}
                  description={`Result: ${item.result || 'N/A'} | Date: ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}`}
                  left={props => <List.Icon {...props} icon="clipboard-list" color="#FF8800" />}
                  style={styles.listItem}
                />
              )}
              ListEmptyComponent={<Text style={{ color: '#fff' }}>No inspections found.</Text>}
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