import { COLORS } from "@/constants/ColorCpc";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Layout = () => {
  const colorScheme = useColorScheme();
  const activeTintColor = colorScheme === "dark" ? "#000" : COLORS.Primary;
  const inactiveTintColor = "#888";
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    backgroundColor: colorScheme === "dark" ? "#121212" : "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    height: 50 + insets.bottom,
    paddingBottom: insets.bottom,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused ? "calendar" : "calendar-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="qrGenerator" // ✅ match the file name
        options={{
          title: "QR Generator",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="qrcode" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
};

export default Layout;

const styles = StyleSheet.create({
  qrButton: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
});
