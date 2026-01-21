import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';

export default function ShoppingScreen() {
  const [items, setItems] = useState([
    { id: 1, name: 'Greek Yogurt', checked: false },
    { id: 2, name: 'Fresh Spinach', checked: true },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <ScrollView style={{ marginTop: 20 }}>
        {items.map(item => (
          <View key={item.id} style={styles.row}>
            <TouchableOpacity style={[styles.check, item.checked && { backgroundColor: COLORS.primary }]}>
              {item.checked && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={[styles.name, item.checked && { textDecorationLine: 'line-through', color: COLORS.gray }]}>
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  check: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: COLORS.primary, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '500' }
});