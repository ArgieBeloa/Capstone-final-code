import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login screen first */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Tab screens inside (tabs) group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
