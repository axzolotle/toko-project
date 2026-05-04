import { insertTestData } from "@/database/db2";
import {
  syncAllTables,
  syncStok,
  testSupabaseConnection
} from "@/database/sync";
import { useCurrentUser } from "@/service/useCurrentUser";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const showUserNowId = async () => {
    const userId = await useCurrentUser();
    console.log("👤 Current User ID from AsyncStorage:", userId);
  };

  const handleSync = async () => {
    try {
      const result = await syncStok();
      console.log("Sync result:", result);
    } catch (error) {
      console.error("Error syncing stok:", error);
    }
  };

  const handleTestData = async () => {
    await insertTestData();
    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Sync ke Supabase
    const result = await syncAllTables();
    console.log("Sync result:", result);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      <Button title="Test Supabase" onPress={testSupabaseConnection} />
      <Button title="Sync stok" onPress={handleSync} />
      <Button title="Sync All Tables" onPress={handleTestData} />
      <Button title="Use Now" onPress={showUserNowId} />
    </View>
  );
}
