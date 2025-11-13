// app/osa/_layout.tsx
import { COLORS } from "@/constants/ColorCpc";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function OsaTabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTintColor: "#fff",
        tabBarActiveTintColor: COLORS.Primary,
        tabBarInactiveTintColor: "gray",
         headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "osa") iconName = "home";
          else if (route.name === "events") iconName = "calendar";
          else if (route.name === "students") iconName = "people";
          else if (route.name === "logout") iconName = "log-out";


          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="osa" options={{ title: "Home" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="students" options={{ title: "Students" }} />
      <Tabs.Screen name="logout" options={{ title: "Log out" }} />

    </Tabs>
  );
}
