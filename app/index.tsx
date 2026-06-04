import { getUserById, initDB } from "@/database/db2";
import { CURRENT_USER_KEY } from "@/service/useCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [target, setTarget] = useState<"/login" | "/(tabs)/transaction" | null>(
    null,
  );

  useEffect(() => {
    const resolveInitialRoute = async () => {
      initDB();

      const storedId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      const userId = storedId ? Number(storedId) : null;
      const validUser =
        userId !== null && !Number.isNaN(userId) ? getUserById(userId) : null;

      if (storedId && !validUser) {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }

      setTarget(validUser ? "/(tabs)/transaction" : "/login");
    };

    resolveInitialRoute();
  }, []);

  if (target) {
    return <Redirect href={target} />;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
