import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { auth, db } from '../../src/services/firebase';
import { COLORS } from '../../src/constants/data';

export default function InventoryScreen() {
  const params = useLocalSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে আইটেম লোড করা (Real-time)
  useEffect(() => {
    const userUid = auth.currentUser?.uid;
    if (!userUid) return;

    const inventoryRef = collection(db, 'users', userUid, 'inventory');
    // নতুন আইটেমগুলো সবার উপরে দেখানোর জন্য orderBy ব্যবহার করা হয়েছে
    const q = query(inventoryRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(fetchedItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ২. স্ক্যানার থেকে নতুন আইটেম আসলে তা Firebase-এ সেভ করা
  useEffect(() => {
    const saveNewItems = async () => {
      if (params.newItems) {
        const detectedItems = JSON.parse(params.newItems as string);
        const userUid = auth.currentUser?.uid;

        if (userUid) {
          const inventoryRef = collection(db, 'users', userUid, 'inventory');

          for (const item of detectedItems) {
            await addDoc(inventoryRef, {
              name: item.name,
              qty: item.qty || '1 unit',
              expiry: item.expiry || item.days || 'N/A',
              progress: 0.7, // আপনি চাইলে লজিক দিয়ে এটি পরিবর্তন করতে পারেন
              color: COLORS.primary,
              createdAt: serverTimestamp() // সময় সেভ করে রাখা হচ্ছে
            });
          }
        }
      }
    };

    saveNewItems();
  }, [params.newItems]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Inventory</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {items.length > 0 ? (
            items.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>{item.qty}</Text>
                  </View>
                  <Text style={[styles.expiryText, { color: item.color || COLORS.primary }]}>
                    {item.expiry} left
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${(item.progress || 0.5) * 100}%`, 
                        backgroundColor: item.color || COLORS.primary 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={80} color={COLORS.gray} />
              <Text style={styles.emptyText}>Your inventory is empty!</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  addBtn: { backgroundColor: COLORS.primary, width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  itemQty: { color: COLORS.gray, fontSize: 14, marginTop: 4 },
  expiryText: { fontWeight: 'bold' },
  progressContainer: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4 },
  progressFill: { height: 8, borderRadius: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: COLORS.gray, marginTop: 10 }
});