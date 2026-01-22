import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, addDoc, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';
import { generateRecipesWithAI } from '../../src/services/aiService';
import { auth, db } from '../../src/services/firebase';

export default function RecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userUid = auth.currentUser?.uid;


  const loadSavedRecipes = async () => {
    if (!userUid) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'users', userUid, 'cachedRecipes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const savedList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(savedList);
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedRecipes();
  }, []);

 
  const generateMoreRecipes = async () => {
    if (!userUid) return;
    setLoading(true);
    try {
      
      const invSnapshot = await getDocs(collection(db, 'users', userUid, 'inventory'));
      const shopSnapshot = await getDocs(collection(db, 'users', userUid, 'shoppingList'));
      
      const allIngredients = Array.from(new Set([
        ...invSnapshot.docs.map(d => d.data().name),
        ...shopSnapshot.docs.map(d => d.data().name)
      ]));

      if (allIngredients.length === 0) {
        alert("Add some ingredients first!");
        return;
      }

      const newAIRecipes = await generateRecipesWithAI(allIngredients);

      
      for (const recipe of newAIRecipes) {
        const recipeWithTime = { ...recipe, createdAt: new Date() };
        await addDoc(collection(db, 'users', userUid, 'cachedRecipes'), recipeWithTime);
      }

 
      setRecipes(prev => [...newAIRecipes, ...prev]);

    } catch (error) {
      console.error("Generate Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const clearAllRecipes = async () => {
    if (!userUid) return;
    const snapshot = await getDocs(collection(db, 'users', userUid, 'cachedRecipes'));
    snapshot.docs.forEach(async (d) => {
      await deleteDoc(doc(db, 'users', userUid, 'cachedRecipes', d.id));
    });
    setRecipes([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Recipes</Text>
          <Text style={styles.subtitle}>{recipes.length} recipes saved</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAllRecipes}>
          <Ionicons name="trash-bin-outline" size={20} color={COLORS.danger || 'red'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSavedRecipes} />}
      >
        {recipes.map((recipe, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push({
              pathname: `../recipe/${index}`,
              params: { recipeData: JSON.stringify(recipe) }
            })}
          >
            <View style={[styles.imageBox, { backgroundColor: recipe.color || COLORS.primary }]} />
            <View style={styles.content}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{recipe.match} Match</Text>
              </View>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeInfo}>⏱ {recipe.time} • {recipe.instructions.substring(0, 60)}...</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Load More Button */}
        <TouchableOpacity 
          style={styles.loadMoreBtn} 
          onPress={generateMoreRecipes}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.loadMoreText}>Generate More Recipes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.gray, fontSize: 14 },
  clearBtn: { padding: 8 },
  card: { backgroundColor: 'white', borderRadius: 25, marginBottom: 15, overflow: 'hidden', elevation: 2 },
  imageBox: { width: '100%', height: 100 },
  content: { padding: 15 },
  matchBadge: { backgroundColor: '#e8f8f5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  matchText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 11 },
  recipeTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 8 },
  recipeInfo: { color: COLORS.gray, marginTop: 4, fontSize: 12 },
  loadMoreBtn: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 20, 
    marginTop: 10, 
    marginBottom: 40 
  },
  loadMoreText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});