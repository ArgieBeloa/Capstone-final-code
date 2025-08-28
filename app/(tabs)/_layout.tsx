import { COLORS } from "@/constants/ColorCpc";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const _layout = () => {
  const colorScheme = useColorScheme();
  const activeTintColor = colorScheme === "dark" ? "#000" : COLORS.Primary;
  const inactiveTintColor = "#888";
const insets = useSafeAreaInsets();
  const tabBarStyle = {
    backgroundColor: colorScheme === "dark" ? "#121212" : "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
     height: 50 + insets.bottom, // ⬅️ add padding for safe area
    paddingBottom: insets.bottom,
  };

  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
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
            const iconName = focused ? "home" : "home-outline"; // You can set a different icon if you want
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
                
      />


      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
           tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused ? "calendar" : "calendar-outline"; // You can set a different icon if you want
            return <Ionicons name={iconName} size={size} color={color} />;
          }, 
        }}
      />
      
      {/* Center QR Scanner */}
      <Tabs.Screen
        name="qrscanner"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="qrcode" size={24} color="#fff" />,
          tabBarButton: ({ accessibilityState, onPress }) => {
            const focused = accessibilityState?.selected ?? false;

            return (
              <Animated.View style={[styles.qrButton, { transform: [{ scale }] }]}>
                <TouchableOpacity
                  onPress={onPress}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  activeOpacity={0.8}
                >
                  <FontAwesome5 name="qrcode" size={24} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
            tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused ? "person" : "person-outline"; // You can set a different icon if you want
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="rates"
        options={{
          title: "Rates",
            tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused ? "star" : "star-outline"; // You can set a different icon if you want
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
};

export default _layout;

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
