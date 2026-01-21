import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>My Fridge AI</Text>
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#2ecc71', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 40, color: '#555' },
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 12, marginBottom: 15 },
  button: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  linkText: { textAlign: 'center', marginTop: 20, color: '#2ecc71' }
});