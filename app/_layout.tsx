import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../src/services/firebase';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
  if (initializing) return;

  const inAuthGroup = segments[0] === '(auth)';
  const inOnboarding = segments[0] === 'onboarding' || segments[0] === undefined;

  if (user) {
    if (user.emailVerified) {
      if (inAuthGroup || inOnboarding) {
        router.replace('/(tabs)');
      } else {
        setIsReady(true);
      }
    } else {
      auth.signOut(); 
      setIsReady(true); 
      router.replace('/(auth)/login');
    }
  } else {
    if (!inAuthGroup && !inOnboarding) {
      router.replace('/onboarding');
    } else {
      setIsReady(true);
    }
  }
}, [user, initializing, segments]);

  if (initializing || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

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