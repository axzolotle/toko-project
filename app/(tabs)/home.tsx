import { useCurrentUser } from "@/service/useCurrentUser";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const { userId } = useCurrentUser();

  const showUserNowId = async () => {
    console.log("👤 Current User ID from AsyncStorage:", userId);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      <Button title="User Now" onPress={showUserNowId} />
    </View>
  );
}
