import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router'; 
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, MOCK_INVENTORY } from '../../src/constants/data';

export default function InventoryScreen() {
  const params = useLocalSearchParams();
  const [items, setItems] = useState(MOCK_INVENTORY);

  useEffect(() => {
   
    if (params.newItems) {
      const detectedItems = JSON.parse(params.newItems as string);
      
    
      const formattedItems = detectedItems.map((item: any, index: number) => ({
        id: Math.random().toString(), 
        name: item.name,
        qty: item.qty,
        days: item.days,
        progress: 0.5,
        color: COLORS.primary
      }));

      setItems(prev => [...formattedItems, ...prev]);
    }
  }, [params.newItems]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Inventory</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.qty}</Text>
              </View>
              <Text style={[styles.expiryText, { color: item.color }]}>{item.expiry} left</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  addBtn: { backgroundColor: COLORS.primary, width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  itemQty: { color: COLORS.gray, fontSize: 14, marginTop: 4 },
  expiryText: { fontWeight: 'bold' },
  progressContainer: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4 },
  progressFill: { height: 8, borderRadius: 4 }
});