import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';
import { generateRecipesWithAI } from '../../src/services/aiService';
import { auth, db } from '../../src/services/firebase';

export default function RecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userUid = auth.currentUser?.uid;

  // ১. Real-time Saved Recipes Load
  useEffect(() => {
    if (!userUid) return;
    
    const q = query(
      collection(db, 'users', userUid, 'cachedRecipes'), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const savedList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecipes(savedList);
    });

    return () => unsubscribe();
  }, [userUid]);

  
  const generateMoreRecipes = async () => {
    if (!userUid) return;
    setLoading(true);

    try {
      
      const invSnapshot = await getDocs(collection(db, 'users', userUid, 'inventory'));
      const allIngredients = invSnapshot.docs.map(d => d.data().name);

      if (allIngredients.length === 0) {
        Alert.alert("Empty Fridge", "Please add some items to your inventory first!");
        setLoading(false);
        return;
      }

      
      const newAIRecipes = await generateRecipesWithAI(allIngredients);

   
      for (const recipe of newAIRecipes) {
        await addDoc(collection(db, 'users', userUid, 'cachedRecipes'), {
          ...recipe,
          createdAt: serverTimestamp(),
          color: recipe.color || COLORS.primary
        });
      }
    } catch (error) {
      console.error("Generate Error:", error);
      Alert.alert("Error", "Failed to generate recipes. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  
  const clearAllRecipes = () => {
    if (!userUid || recipes.length === 0) return;

    Alert.alert("Clear All", "Are you sure you want to delete all saved recipes?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: async () => {
          const snapshot = await getDocs(collection(db, 'users', userUid, 'cachedRecipes'));
          snapshot.docs.forEach(async (d) => {
            await deleteDoc(doc(db, 'users', userUid, 'cachedRecipes', d.id));
          });
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Chef</Text>
          <Text style={styles.subtitle}>{recipes.length} recipes in collection</Text>
        </View>
        {recipes.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearAllRecipes}>
            <Ionicons name="trash-bin-outline" size={22} color="#FF4444" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            onPress={() => router.push({
              pathname: `../recipe/${recipe.id}`,
              params: { recipeData: JSON.stringify(recipe) }
            })}
          >
            
            <View style={[styles.imageBox, { backgroundColor: recipe.color || '#E8F5E9' }]}>
               <Ionicons name="fast-food-outline" size={40} color="white" style={{ opacity: 0.6 }} />
            </View>
            
            <View style={styles.content}>
              <View style={styles.tagRow}>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{recipe.match || 'High'} Match</Text>
                </View>
                <Text style={styles.timeText}>⏱ {recipe.time}</Text>
              </View>

              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              
            
              <Text style={styles.recipeInfo} numberOfLines={1}>
                Using: {recipe.usedIngredients || "Inventory Items"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        
        <TouchableOpacity 
          style={[styles.loadMoreBtn, loading && { opacity: 0.8 }]} 
          onPress={generateMoreRecipes}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.loadMoreText}>Ask AI for Recipes</Text>
            </>
          )}
        </TouchableOpacity>

        {recipes.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>Your recipe book is empty.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  clearBtn: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 12 },
  card: { backgroundColor: 'white', borderRadius: 24, marginBottom: 18, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10 },
  imageBox: { width: '100%', height: 110, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 18 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  matchText: { color: '#166534', fontWeight: 'bold', fontSize: 11 },
  timeText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  recipeTitle: { fontSize: 19, fontWeight: 'bold', marginTop: 10, color: '#1F2937' },
  recipeInfo: { color: '#9CA3AF', marginTop: 6, fontSize: 13 },
  loadMoreBtn: { 
    backgroundColor: '#111827', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 20, 
    marginTop: 15, 
    marginBottom: 40 
  },
  loadMoreText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#BBB', marginTop: 10, fontSize: 16 }
});