import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import {
  ensureDefaultUser,
  getAllItems,
  getAllKas,
  getAllStok,
  getAllTransaksi,
  getAllUsers,
  initDB,
} from "../database/db2";

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

      // 4. Log all data from each table
      console.log("\n📊 === DATA DARI DATABASE ===");

      const users = getAllUsers();
      console.log("👥 USERS:", users);

      const kas = getAllKas();
      console.log("💰 KAS:", kas);

      const items = getAllItems();
      console.log("📦 ITEMS:", items);

      const transaksi = getAllTransaksi();
      console.log("💳 TRANSAKSI:", transaksi);

      const stok = getAllStok();
      console.log("📊 STOK:", stok);

      console.log("✅ === SELESAI ===\n");
    } catch (error) {
      console.error("❌ Error initializing database:", error);
    }
  };

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar />
    </>
  );
}
