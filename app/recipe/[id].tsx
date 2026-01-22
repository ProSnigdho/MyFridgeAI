import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../src/constants/data';

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const recipe = params.recipeData ? JSON.parse(params.recipeData as string) : null;

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found!</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: COLORS.primary, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Image/Color Box */}
        <View style={[styles.imageHeader, { backgroundColor: recipe.color || '#f0f0f0' }]}>
          <View style={styles.headerOverlay}>
            <Ionicons name="restaurant" size={80} color="white" style={{ opacity: 0.5 }} />
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{recipe.match} Ingredients Match</Text>
          </View>

          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.infoRow}>
            <InfoItem icon="time-outline" label={recipe.time || "20 mins"} />
            <InfoItem icon="flame-outline" label="Medium Cal" />
            <InfoItem icon="star" label="4.8" color="#f1c40f" />
          </View>

          {/* Ingredients Section */}
          <Text style={styles.sectionTitle}>Ingredients Needed</Text>
          <View style={{ marginBottom: 20 }}>
            {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
              recipe.ingredients.map((ing: any, index: number) => (
                <IngredientItem 
                  key={index} 
                  name={typeof ing === 'string' ? ing : ing.name} 
                  qty={ing.qty || ""} 
                />
              ))
            ) : (
              <Text style={styles.stepsText}>No specific ingredients listed.</Text>
            )}
          </View>

          {/* Instructions Section */}
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsText}>
              {recipe.instructions}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.mainButton, { backgroundColor: recipe.color || '#2ecc71' }]}>
          <Text style={styles.mainButtonText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Sub Components ---
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

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageHeader: { width: '100%', height: 250, justifyContent: 'center', alignItems: 'center' },
  headerOverlay: { alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 12, elevation: 5 },
  content: { 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    marginTop: -30, 
    backgroundColor: 'white' 
  },
  matchBadge: { backgroundColor: '#e8f8f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 10 },
  matchText: { color: '#2ecc71', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  infoRow: { flexDirection: 'row', marginTop: 15, marginBottom: 25 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  infoLabel: { marginLeft: 5, color: '#555', fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, marginTop: 10, color: '#222' },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ecc71', marginRight: 12 },
  ingName: { flex: 1, fontSize: 16, color: '#444' },
  ingQty: { color: '#888', fontWeight: '600' },
  stepsContainer: { 
    backgroundColor: '#f9f9f9', 
    padding: 15, 
    borderRadius: 15, 
    marginTop: 5 
  },
  stepsText: { 
    fontSize: 16, 
    lineHeight: 26, 
    color: '#555' 
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: 'white' },
  mainButton: { padding: 18, borderRadius: 20, alignItems: 'center', elevation: 3 },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});