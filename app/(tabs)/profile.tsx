import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.name}>Sarah Jenkins</Text>
        <Text style={styles.email}>sarah.j@example.com</Text>
      </View>

      <View style={styles.menuSection}>
        <ProfileMenu icon="person-outline" label="Account Settings" />
        <ProfileMenu icon="notifications-outline" label="Notifications" />
        <ProfileMenu icon="shield-checkmark-outline" label="Privacy Policy" />
        <ProfileMenu icon="help-circle-outline" label="Help & Support" />
        
        <TouchableOpacity style={[styles.menuItem, {marginTop: 20}]}>
          <MaterialIcons name="logout" size={24} color="#e74c3c" />
          <Text style={[styles.menuLabel, {color: '#e74c3c'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const ProfileMenu = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileInfo: { alignItems: 'center', marginTop: 40 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { color: '#888', marginTop: 5 },
  menuSection: { marginTop: 40, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  menuLabel: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500' },
});