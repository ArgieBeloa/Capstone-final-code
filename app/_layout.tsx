import { UserProvider } from "@/src/userContext";
import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Login screen first */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Tab screens inside (tabs) group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(officer)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="osa" options={{ headerShown: false }} /> */}
        
        
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="qrGenerator" options={{ headerShown: false }} />
        <Stack.Screen name="testDesign" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
