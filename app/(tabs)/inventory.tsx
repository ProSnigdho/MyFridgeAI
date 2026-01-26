import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot,
  orderBy, query, serverTimestamp
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';
import { auth, db } from '../../src/services/firebase';

export default function InventoryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [newItem, setNewItem] = useState({ name: '', qty: '', days: '7' });

  const userUid = auth.currentUser?.uid;


  useEffect(() => {
    if (!userUid) return;
    const q = query(collection(db, 'users', userUid, 'inventory'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => {
        const data = doc.data();


        let totalDays = 7;
        if (data.expiry && typeof data.expiry === 'string') {
          totalDays = parseInt(data.expiry.split(' ')[0]) || 7;
        } else if (typeof data.expiry === 'number') {
          totalDays = data.expiry;
        }

        const createdDate = data.createdAt?.toDate() || new Date();
        const today = new Date();
        const diffTime = today.getTime() - createdDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const remaining = totalDays - diffDays;
        const progress = totalDays > 0 ? Math.max(0, remaining / totalDays) : 0;

        return {
          id: doc.id,
          ...data,
          remainingDays: remaining > 0 ? remaining : 0,
          currentProgress: progress
        };
      });
      setItems(fetchedItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userUid]);


  const handleAddManual = async () => {
    if (!newItem.name || !userUid) return;
    try {
      await addDoc(collection(db, 'users', userUid, 'inventory'), {
        name: newItem.name,
        qty: newItem.qty || '1 unit',
        expiry: `${newItem.days} days`,
        createdAt: serverTimestamp(),
      });
      setModalVisible(false);
      setNewItem({ name: '', qty: '', days: '7' });
    } catch (error) {
      console.error(error);
    }
  };

 
  const markAsUsed = (id: string) => {
    Alert.alert("Item Used", "Remove this from your fridge?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Used", style: "destructive", onPress: async () => {
          await deleteDoc(doc(db, 'users', userUid!, 'inventory', id));
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Fridge</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/scanner')}>
            <Ionicons name="camera" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {items.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardInfo}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>{item.qty}</Text>
                </View>
                <TouchableOpacity onPress={() => markAsUsed(item.id)}>
                  <MaterialCommunityIcons name="check-circle-outline" size={28} color="#ddd" />
                </TouchableOpacity>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressFill, {
                    width: `${item.currentProgress * 100}%`,
                    backgroundColor: item.remainingDays < 2 ? '#FF4444' : COLORS.primary
                  }]} />
                </View>
                <Text style={[styles.expiryText, { color: item.remainingDays < 2 ? '#FF4444' : '#666' }]}>
                  {item.remainingDays} days left
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Manual Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Item Manually</Text>
            <TextInput
              placeholder="Item Name (e.g. Milk)"
              style={styles.input}
              onChangeText={(t) => setNewItem({ ...newItem, name: t })}
            />
            <TextInput
              placeholder="Quantity (e.g. 2 liters)"
              style={styles.input}
              onChangeText={(t) => setNewItem({ ...newItem, qty: t })}
            />
            <TextInput
              placeholder="Expiry in Days (default 7)"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={(t) => setNewItem({ ...newItem, days: t })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddManual} style={styles.saveBtn}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add to Fridge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111827' },
  headerIcon: { marginRight: 15, backgroundColor: '#E8F5E9', padding: 10, borderRadius: 12 },
  addBtn: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 12, elevation: 3 },
  card: { backgroundColor: 'white', padding: 18, borderRadius: 24, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  cardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  itemQty: { color: '#6B7280', fontSize: 14 },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, marginRight: 10 },
  progressFill: { height: 8, borderRadius: 4 },
  expiryText: { fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 24, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { padding: 15, marginRight: 10 },
  saveBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12 }
});