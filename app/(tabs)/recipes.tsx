import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, MOCK_RECIPES } from '../../src/constants/data';
import { useRouter } from 'expo-router';

export default function RecipesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recommended Recipes</Text>
      <Text style={styles.subtitle}>Based on your ingredients</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
        {MOCK_RECIPES.map(recipe => (
          <TouchableOpacity 
            key={recipe.id} 
            style={styles.card} 
            onPress={() => router.push(`/recipe/${recipe.id}`)}
          >
            <View style={[styles.imageBox, { backgroundColor: recipe.color }]} />
            <View style={styles.content}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{recipe.match} Match</Text>
              </View>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeInfo}>⏱ {recipe.time} • Easy Prep</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: COLORS.text },
  subtitle: { color: COLORS.gray, fontSize: 14, marginTop: 5 },
  card: { backgroundColor: 'white', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  imageBox: { width: '100%', height: 180 },
  content: { padding: 15 },
  matchBadge: { backgroundColor: '#e8f8f5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  matchText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: COLORS.text },
  recipeInfo: { color: COLORS.gray, marginTop: 5, fontSize: 13 }
});