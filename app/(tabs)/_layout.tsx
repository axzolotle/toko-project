import { darkColors, lightColors } from "@/styles/KasirStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.btnPrimaryBg,
          tabBarInactiveTintColor: colors.stepLabelText,
          tabBarStyle: {
            height: Platform.OS === "ios" ? 80 : 62,
            paddingBottom: Platform.OS === "ios" ? 20 : 8,
            paddingTop: 6,
            borderTopWidth: 0.5,
            borderTopColor:
              colorScheme === "dark" ? colors.stepInactiveBorder : "#e2e8f0",
            backgroundColor: colors.pageBg,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="laporan"
          options={{
            title: "Laporan",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "document-text" : "document-text-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: "Transaksi",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "cash" : "cash-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="item"
          options={{
            title: "Item",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="test"
          options={{
            title: "Testing",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "analytics" : "analytics-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
