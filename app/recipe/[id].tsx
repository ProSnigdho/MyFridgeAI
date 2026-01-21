import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.imageHeader} />
        
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Creamy Mushroom Pasta</Text>
          
          <View style={styles.infoRow}>
            <InfoItem icon="time-outline" label="25 mins" />
            <InfoItem icon="flame-outline" label="350 kcal" />
            <InfoItem icon="star" label="4.8" color="#f1c40f" />
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <IngredientItem name="Pasta" qty="200g" />
          <IngredientItem name="Mushrooms" qty="150g" />
          <IngredientItem name="Heavy Cream" qty="100ml" />

          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.steps}>
            1. Boil the pasta in salted water.{"\n"}
            2. Sauté mushrooms in garlic and butter.{"\n"}
            3. Add cream and simmer until thick.{"\n"}
            4. Mix with pasta and serve hot.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const InfoItem = ({ icon, label, color = "#888" }: any) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={18} color={color} />
    <Text style={styles.infoLabel}>{label}</Text>
  </View>
);

const IngredientItem = ({ name, qty }: any) => (
  <View style={styles.ingRow}>
    <View style={styles.dot} />
    <Text style={styles.ingName}>{name}</Text>
    <Text style={styles.ingQty}>{qty}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageHeader: { width: '100%', height: 300, backgroundColor: '#f0f0f0' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 12 },
  content: { padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'white' },
  title: { fontSize: 26, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginTop: 20, marginBottom: 30 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  infoLabel: { marginLeft: 5, color: '#555' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2ecc71', marginRight: 10 },
  ingName: { flex: 1, fontSize: 16 },
  ingQty: { color: '#888' },
  steps: { fontSize: 16, lineHeight: 26, color: '#555' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  mainButton: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 15, alignItems: 'center' },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});