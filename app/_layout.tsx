import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';
import { EmergencyProvider } from '../contexts/EmergencyContext';
import { useEffect } from 'react';
import { initializeI18n } from '../lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    initializeI18n();
  }, []);
  return (
    <AuthProvider>
      <LocationProvider>
        <EmergencyProvider>
          <QueryClientProvider client={queryClient}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="emergency" options={{ headerShown: false }} />
              <Stack.Screen name="structure" options={{ title: 'Структура' }} />
              <Stack.Screen name="agent" options={{ title: 'Туроператор' }} />
            </Stack>
            <StatusBar style="auto" />
          </QueryClientProvider>
        </EmergencyProvider>
      </LocationProvider>
    </AuthProvider>
  );
}