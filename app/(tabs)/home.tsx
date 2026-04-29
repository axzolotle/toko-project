import { syncUsers, testSupabaseConnection } from "@/database/sync";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const handleSync = async () => {
    try {
      const result = await syncUsers();
      console.log("Sync result:", result);
    } catch (error) {
      console.error("Error syncing users:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      <Button title="Test Supabase" onPress={testSupabaseConnection} />
      <Button title="Sync Users" onPress={handleSync} />
    </View>
  );
}
