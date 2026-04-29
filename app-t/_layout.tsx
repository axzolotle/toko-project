import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDatabase } from '../database/db';

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="barang/new"
        options={{ headerShown: true, title: 'Tambah Barang', headerBackTitle: 'Kembali' }}
      />
      <Stack.Screen
        name="barang/[id]"
        options={{ headerShown: true, title: 'Edit Barang', headerBackTitle: 'Kembali' }}
      />
    </Stack>
  );
}
