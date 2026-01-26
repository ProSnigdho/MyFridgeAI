import { useRouter } from 'expo-router';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification, 
  signOut 
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { COLORS } from '../../src/constants/data';
import { auth, db } from '../../src/services/firebase';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    // ১. ভ্যালিডেশন চেক
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // ২. Firebase Auth এ ইউজার ক্রিয়েট করা
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ৩. ইউজারের নাম (DisplayName) আপডেট করা
      await updateProfile(user, {
        displayName: name
      });

      // ৪. ইমেল ভেরিফিকেশন লিঙ্ক পাঠানো
      await sendEmailVerification(user);

      // ৫. Firestore ডাটাবেসে ইউজার ইনফরমেশন সেভ করা
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        isVerified: false,
        createdAt: serverTimestamp(),
      });

      // ৬. ইউজারকে লগআউট করে দেওয়া (যাতে সে ভেরিফাই না করে ঢুকতে না পারে)
      // কারণ Firebase অটোমেটিক সাইন-আপের পর লগইন করে দেয়
      await signOut(auth);

      setLoading(false);
      Alert.alert(
        "Verify Your Email",
        `A verification link has been sent to ${email}. Please check your inbox and verify your account before logging in.`,
        [
          { 
            text: "Go to Login", 
            onPress: () => router.replace('/(auth)/login') 
          }
        ]
      );

    } catch (error: any) {
      setLoading(false);
      let errorMessage = "An error occurred during sign up.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }
      
      Alert.alert("Sign Up Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} disabled={loading}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: COLORS.background 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    color: COLORS.text, 
    textAlign: 'center' 
  },
  input: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10, 
    height: 55, 
    justifyContent: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  linkText: { 
    color: COLORS.gray, 
    textAlign: 'center', 
    marginTop: 20 
  }
});