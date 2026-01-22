import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth'; // Firebase Logout
import { auth } from '../../src/services/firebase'; // Firebase Config
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/data';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // বর্তমানে লগইন থাকা ইউজারের তথ্য সেট করা
    if (auth.currentUser) {
      setUser(auth.currentUser);
    }
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut(auth);
              // লগআউট হওয়ার পর অটোমেটিক রুট লেআউট আপনাকে লগইন পেজে নিয়ে যাবে
              router.replace('/(auth)/login');
            } catch (error) {
              console.error("Logout Error: ", error);
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarPlaceholder}>
           <Ionicons name="person" size={50} color="#ccc" />
        </View>
        <Text style={styles.name}>{user?.displayName || 'User Name'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <ProfileMenu icon="person-outline" label="Account Settings" />
        <ProfileMenu icon="notifications-outline" label="Notifications" />
        <ProfileMenu icon="shield-checkmark-outline" label="Privacy Policy" />
        <ProfileMenu icon="help-circle-outline" label="Help & Support" />
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.menuItem, {marginTop: 20}]} 
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#e74c3c" />
          <Text style={[styles.menuLabel, {color: '#e74c3c'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const ProfileMenu = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileInfo: { alignItems: 'center', marginTop: 40 },
  avatarPlaceholder: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#f0f0f0', 
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { color: '#888', marginTop: 5 },
  menuSection: { marginTop: 40, paddingHorizontal: 20 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f9f9f9' 
  },
  menuLabel: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500', color: '#333' },
});