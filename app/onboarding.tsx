import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../src/services/firebase';

export default function Onboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    if (auth.currentUser) {
      router.replace('/(tabs)/inventory');
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imagePlaceholder}>
           <Text style={{fontSize: 50}}>🍎</Text>
        </View>
        <Text style={styles.title}>Smart Cooking Starts with Your Fridge</Text>
        <Text style={styles.subtitle}>
          Scan your items, track expiry dates, and get AI-powered recipes instantly.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 25 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { width: 250, height: 250, backgroundColor: '#e8f8f5', borderRadius: 125, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 15, lineHeight: 24 },
  footer: { paddingBottom: 20 },
  button: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});