import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="onboarding" /> 
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="scanner/index" options={{ presentation: 'modal' }} />
    </Stack>
  );
}