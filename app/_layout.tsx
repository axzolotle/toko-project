import { useSyncManager } from "@/hooks/Network";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import {
  getAllItems,
  getAllKas,
  getAllStok,
  getAllTransaksi,
  getAllUsers,
  initDB,
} from "../database/db2";

export default function RootLayout() {
  useSyncManager();

  useEffect(() => {
    initDB();
    console.log("✅ Database initialized");

    // Log all data from each table
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
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar />
    </>
  );
}
