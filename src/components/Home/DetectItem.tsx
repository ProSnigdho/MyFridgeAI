import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type DetectedItemRowProps = {
  name: string;
  confidence: string;
  icon: string;
};

const DetectedItemRow = ({ name, confidence, icon }: DetectedItemRowProps) => (
  <View style={styles.itemRow}>
    <View style={styles.itemInfo}>
      <Ionicons name={icon as any} size={20} color="#2ecc71" />
      <Text style={styles.itemName}>{name}</Text>
    </View>
    <Text style={styles.confidenceText}>{confidence}</Text>
  </View>
);

export default DetectedItemRow;

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#333',
  },
  confidenceText: {
    fontSize: 14,
    color: '#888',
  },
});