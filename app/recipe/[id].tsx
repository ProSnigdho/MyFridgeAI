import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { COLORS } from '../../src/constants/data';

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const recipe = params.recipeData ? JSON.parse(params.recipeData as string) : null;

  if (!recipe) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="silverware-clean" size={60} color="#DDD" />
        <Text style={{ marginTop: 10, color: '#999' }}>Recipe not found!</Text>
        <TouchableOpacity style={styles.errorBtn} onPress={() => router.back()}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

 
  const steps = recipe.instructions?.split(/[.!?]\s+/).filter((s: string) => s.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* --- Header Area --- */}
        <View style={[styles.imageHeader, { backgroundColor: recipe.color || COLORS.primary }]}>
          <Ionicons name="restaurant" size={100} color="rgba(255,255,255,0.3)" />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* --- Floating Content Card --- */}
        <View style={styles.content}>
          <View style={styles.topInfo}>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>✨ AI RECOMMENDED</Text>
            </View>
            <Text style={styles.title}>{recipe.title}</Text>
          </View>

          <View style={styles.infoRow}>
            <InfoItem icon="clock-outline" label={recipe.time || "20 mins"} />
            <InfoItem icon="leaf-outline" label="Healthy" />
            <InfoItem icon="star-outline" label="Top Choice" />
          </View>

          <View style={styles.divider} />

          {/* --- Ingredients Section --- */}
          <Text style={styles.sectionTitle}>Ingredients Needed</Text>
          <View style={styles.ingContainer}>
            {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
              recipe.ingredients.map((ing: any, index: number) => (
                <IngredientItem 
                  key={index} 
                  name={typeof ing === 'string' ? ing : ing.name} 
                  qty={ing.qty || ""} 
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No specific ingredients listed.</Text>
            )}
          </View>

          {/* --- Instructions Section (Steps) --- */}
          <Text style={styles.sectionTitle}>Cooking Steps</Text>
          {steps && steps.length > 0 ? (
            steps.map((step: string, index: number) => (
              <View key={index} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: recipe.color || COLORS.primary }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step.trim()}.</Text>
              </View>
            ))
          ) : (
            <Text style={styles.stepText}>{recipe.instructions}</Text>
          )}
        </View>
      </ScrollView>

      {/* --- Floating Footer --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#111827' }]}>
          <Text style={styles.mainButtonText}>Mark as Cooked</Text>
          <MaterialCommunityIcons name="fire" size={20} color="#FFBB33" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Sub Components ---
const InfoItem = ({ icon, label }: any) => (
  <View style={styles.infoItem}>
    <MaterialCommunityIcons name={icon} size={18} color="#6B7280" />
    <Text style={styles.infoLabel}>{label}</Text>
  </View>
);

const IngredientItem = ({ name, qty }: any) => (
  <View style={styles.ingRow}>
    <View style={styles.ingCheck}>
      <Ionicons name="checkmark" size={12} color="white" />
    </View>
    <Text style={styles.ingName}>{name}</Text>
    <Text style={styles.ingQty}>{qty}</Text>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorBtn: { marginTop: 15, backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  imageHeader: { width: '100%', height: 280, justifyContent: 'center', alignItems: 'center' },
  backBtn: { 
    position: 'absolute', top: 50, left: 20, 
    backgroundColor: 'white', width: 45, height: 45, 
    borderRadius: 15, justifyContent: 'center', 
    alignItems: 'center', elevation: 10, shadowOpacity: 0.1 
  },
  content: { 
    padding: 24, 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    marginTop: -40, 
    backgroundColor: 'white',
    minHeight: 500
  },
  topInfo: { marginBottom: 15 },
  matchBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  matchText: { color: '#166534', fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827', lineHeight: 34 },
  infoRow: { flexDirection: 'row', marginBottom: 25, justifyContent: 'space-between' },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { marginLeft: 6, color: '#6B7280', fontWeight: '600', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 15, color: '#111827' },
  ingContainer: { marginBottom: 20 },
  ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12 },
  ingCheck: { width: 20, height: 20, borderRadius: 6, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  ingName: { flex: 1, fontSize: 15, color: '#374151', fontWeight: '500' },
  ingQty: { color: '#6B7280', fontWeight: 'bold', fontSize: 13 },
  stepRow: { flexDirection: 'row', marginBottom: 20 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15, marginTop: 2 },
  stepNumberText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  stepText: { flex: 1, fontSize: 15, lineHeight: 24, color: '#4B5563' },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: 24, backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1, borderTopColor: '#F3F4F6'
  },
  mainButton: { 
    height: 60, borderRadius: 20, 
    flexDirection: 'row', justifyContent: 'center', 
    alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2 
  },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic' }
});