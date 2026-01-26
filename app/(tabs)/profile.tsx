import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';
import { auth, db } from '../../src/services/firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(auth.currentUser);
  const [userName, setUserName] = useState(auth.currentUser?.displayName || 'User');
  const [editModal, setEditModal] = useState(false);
  const [newName, setNewName] = useState(userName);

  useEffect(() => {
    if (!auth.currentUser) return;

    // ১. Firestore থেকে রিয়েল-টাইম নাম আপডেট রাখা
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserName(doc.data().name);
      }
    });

    return () => unsub();
  }, []);

  // ২. প্রোফাইল আপডেট ফাংশন
  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Firebase Auth আপডেট
        await updateProfile(currentUser, { displayName: newName });
        // Firestore আপডেট
        await updateDoc(doc(db, "users", currentUser.uid), {
          name: newName
        });
        setEditModal(false);
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Could not update profile");
    }
  };

  // ৩. লগআউট ফাংশন
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace('/(auth)/login');
          } catch (error) {
            console.error(error);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{userName[0]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <ProfileMenu 
          icon="person-outline" 
          label="Account Settings" 
          onPress={() => setEditModal(true)} 
        />
        <ProfileMenu 
          icon="notifications-outline" 
          label="Notifications" 
          onPress={() => Alert.alert("Notifications", "No new alerts.")} 
        />
        <ProfileMenu 
          icon="help-circle-outline" 
          label="Help & Support" 
          onPress={() => Alert.alert("Support", "Contact: support@chefai.com")} 
        />
        
        <TouchableOpacity style={[styles.menuItem, {marginTop: 20}]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#e74c3c" />
          <Text style={[styles.menuLabel, {color: '#e74c3c'}]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Name Modal */}
      <Modal visible={editModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Name</Text>
            <TextInput 
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModal(false)} style={styles.cancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateName} style={styles.saveBtn}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: COLORS.primary, marginBottom: 15,
    justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10
  },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  email: { color: '#6B7280', marginTop: 5 },
  menuSection: { marginTop: 40, paddingHorizontal: 20 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' 
  },
  menuLabel: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500', color: '#374151' },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { padding: 15, marginRight: 10 },
  saveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12 }
});