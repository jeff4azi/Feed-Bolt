import { Stack } from 'expo-router';
import './globals.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="post-detail" options={{ headerShown: false }} />
      <Stack.Screen name="create-post" options={{ headerShown: false }} />
      <Stack.Screen name="user-profile" options={{ headerShown: false }} />
    </Stack>
  );
}
