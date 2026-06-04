import { ThemeProvider } from "@/lib/ThemeContext";
import { CURRENT_USER_KEY } from "@/service/useCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import {
  ensureDefaultUser,
  getAllItems,
  getAllKas,
  getAllRekapHarian,
  getAllStok,
  getAllTransaksi,
  getAllUsers,
  getUserById,
  initDB
} from "../database/db2";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [dbReady, setDbReady] = useState(false);

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

      // 2. Ensure default user exists, but do not auto-login it.
      ensureDefaultUser();

      console.log("Database initialized successfully.\n");
    } catch (error) {
      console.error("❌ Error initializing database:", error);
    } finally {
      setDbReady(true);
    }
  };

  useEffect(() => {
    if (!dbReady) return;

    const guardRoute = async () => {
      const firstSegment = segments[0];
      const inAuthRoute = firstSegment === "login";
      const inTabsRoute = firstSegment === "(tabs)";
      const storedId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      const userId = storedId ? Number(storedId) : null;
      const validUser =
        userId !== null && !Number.isNaN(userId) ? getUserById(userId) : null;

      if (storedId && !validUser) {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }

      if (validUser && (inAuthRoute || firstSegment === undefined)) {
        router.replace("/(tabs)/transaction");
        return;
      }

      if (!validUser && inTabsRoute) {
        router.replace("/login");
      }
    };

    guardRoute();
  }, [dbReady, router, segments]);

  return (
    <ThemeProvider>
      <>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar />
      </>
    </ThemeProvider>
  );
}
