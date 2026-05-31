import { ThemeProvider } from "@/lib/ThemeContext";
import { CURRENT_USER_KEY } from "@/service/useCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import {
  ensureDefaultUser,
  getAllItems,
  getAllKas,
  getAllRekapHarian,
  getAllStok,
  getAllTransaksi,
  getAllUsers,
  initDB
} from "../database/db2";

export default function RootLayout() {
  // useSyncManager();
  // dropAllTables(); // HATI-HATI: Ini akan menghapus semua data di database, gunakan hanya untuk testing!
  // seedDummyKonterData();
  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      // 1. Initialize database schema

      initDB();
      console.log("✅ Database initialized");

      const users = getAllUsers();
      console.log("User : ", users);
      const items = getAllItems();
      console.log("items : ", items);
      const transaksi = getAllTransaksi();
      console.log("Transaksi : ", transaksi);
      const stok = getAllStok();
      console.log("Stok : ", stok);
      const kas = getAllKas();
      console.log("Kas : ", kas);
      const rekapHarian = getAllRekapHarian();
      console.log("rekap harian : ", rekapHarian);

      // console.log(db.getAllSync("SELECT * FROM kas LIMIT 1"));

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
