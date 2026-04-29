import { Tabs } from "expo-router";
import { Platform, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 62,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: "#e2e8f0",
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Kasir",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? "🛒" : "🛍️"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="laporan"
        options={{
          title: "Laporan",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? "📊" : "📈"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="barang"
        options={{
          title: "Barang",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? "📦" : "🗂️"}</Text>
          ),
        }}
      />
    </Tabs>
  );
}
