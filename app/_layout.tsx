import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { ensureDefaultUser, initDB } from "../database/db2";
import { ThemeProvider } from "@/lib/ThemeContext";

const CURRENT_USER_KEY = "@toko_current_user_id";

export default function RootLayout() {
  // useSyncManager();
  // dropAllTables(); // HATI-HATI: Ini akan menghapus semua data di database, gunakan hanya untuk testing!
  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      // 1. Initialize database schema

      initDB();
      console.log("✅ Database initialized");

      // 2. Ensure default user exists
      const defaultUserId = ensureDefaultUser();

      // 3. Set default user to AsyncStorage jika belum ada
      const currentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!currentUser) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, defaultUserId.toString());
        console.log("✅ Default user set to AsyncStorage:", defaultUserId);
      }

      console.log("Database initialized successfully.\n");
    } catch (error) {
      console.error("❌ Error initializing database:", error);
    }
  };

  return (
    <ThemeProvider>
      <>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar />
      </>
    </ThemeProvider>
  );
}
