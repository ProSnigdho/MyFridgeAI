import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FridgeItemProps {
  name: string;
  qty: string | number;
  days: string | number;
  progress: number;
  color: string;
}

const FridgeItem = ({ name, qty, days, progress, color }: FridgeItemProps) => (
  <View style={styles.itemRow}>
    <View style={styles.itemIconBox} />
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemQty}>Quantity: {qty}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
    <Text style={[styles.expiryText, { color: color }]}>{days}</Text>
  </View>
);

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginRight: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemQty: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FridgeItem;