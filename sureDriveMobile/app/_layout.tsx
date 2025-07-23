import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getProfile } from '../services/storage';

export default function RootLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      setLoading(true);
      try {
        const profile = await getProfile();
        setRole(profile?.role || null);
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    loadRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sure Drive' }} />
      <Stack.Screen name="Welcome" options={{ title: 'Welcome' }} />
      <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
      <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="book-inspection" options={{ title: 'Book Inspection' }} />
      <Stack.Screen name="make-payment" options={{ title: 'Make Payment' }} />
      <Stack.Screen name="report-issue" options={{ title: 'Report Issue' }} />
      <Stack.Screen name="chat-support/[issueId]" options={{ title: 'Support Chat' }} />
      <Stack.Screen name="edit-user/[userId]" options={{ title: 'Edit User' }} />
      <Stack.Screen name="edit-vehicle/[vehicleId]" options={{ title: 'Edit Vehicle' }} />
      { (role === 'admin' || role === 'inspector') && <Stack.Screen name="vehicles" options={{ title: 'Vehicles' }} /> }
      { (role === 'admin' || role === 'inspector') && <Stack.Screen name="inspections" options={{ title: 'Inspections' }} /> }
      { role === 'admin' && <Stack.Screen name="admin" options={{ title: 'Admin' }} /> }
    </Stack>
  );
} 