import * as React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ title: 'Register', headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="vehicle" options={{ title: 'Vehicle Management' }} />
        <Stack.Screen name="inspection" options={{ title: 'Inspection Booking' }} />
        <Stack.Screen name="payment" options={{ title: 'Payments' }} />
        <Stack.Screen name="support" options={{ title: 'Support' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile & Settings' }} />
      </Stack>
    </PaperProvider>
  );
}
