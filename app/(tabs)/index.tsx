import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';
import { auth, db } from '../../src/services/firebase';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [inventory, setInventory] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, expiring: 0 });

  useEffect(() => {
    const userUid = auth.currentUser?.uid;
    if (!userUid) return;

    if (auth.currentUser?.displayName) setUserName(auth.currentUser.displayName.split(' ')[0]);

    // ১. Inventory Sync
    const invQ = query(collection(db, 'users', userUid, 'inventory'), orderBy('createdAt', 'desc'), limit(3));
    const unsubInv = onSnapshot(invQ, (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
      setStats({
        total: snap.size,
        expiring: items.filter((i: any) => (i.progress || 1) < 0.4).length
      });
      setLoading(false);
    });

    // ২. AI Recipes Sync
    const recQ = query(collection(db, 'users', userUid, 'cachedRecipes'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRec = onSnapshot(recQ, (snap) => {
      const recList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recList);
    });

    return () => { unsubInv(); unsubRec(); };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* --- Header Section --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{new Date().toDateString().toUpperCase()}</Text>
            <Text style={styles.greeting}>Hey, {userName}!</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userName[0]}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* --- Stats Glass Card --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statSub}>Total Items</Text>
          </View>
          <View style={[styles.statDivider]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.danger || '#FF4444' }]}>{stats.expiring}</Text>
            <Text style={styles.statSub}>Expiring Soon</Text>
          </View>
        </View>

        {/* --- Smart Recipes (Horizontal Slider) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Smart Recipes</Text>
          <TouchableOpacity onPress={() => router.push('/recipes')}>
            <Text style={styles.seeAllText}>Explore All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeScroll}>
          {recipes.length > 0 ? recipes.map((recipe, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recipeCard}
              onPress={() => router.push({ pathname: `../recipe/${recipe.id}`, params: { recipeData: JSON.stringify(recipe) } })}
            >
              <View style={[styles.recipeImg, { backgroundColor: index % 2 === 0 ? '#E1F5FE' : '#F3E5F5' }]}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={40} color={COLORS.primary} />
              </View>
              <View style={styles.recipeContent}>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>AI RECOMMENDED</Text>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
              </View>
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyCard}><Text style={styles.emptyText}>No recipes yet. Add items!</Text></View>
          )}
        </ScrollView>

        {/* --- Recent Inventory --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fresh in Fridge</Text>
          <TouchableOpacity onPress={() => router.push('/inventory')}>
            <Text style={styles.seeAllText}>See Inventory</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inventoryList}>
          {inventory.map((item) => (
            <View key={item.id} style={styles.invItem}>
              <View style={styles.invIcon}>
                <MaterialCommunityIcons name="food-variant" size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.invName}>{item.name}</Text>
                <Text style={styles.invQty}>{item.qty || '1 unit'}</Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.expDate}>{item.expiry}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* --- Minimal FAB --- */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/scanner')}>
        <Ionicons name="scan-outline" size={24} color="white" />
        <Text style={styles.fabText}>SCAN FOOD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  dateText: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', letterSpacing: 1 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  profileBtn: { elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarPlaceholder: { width: 45, height: 45, borderRadius: 23, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 18 },

  statsContainer: {
    flexDirection: 'row', backgroundColor: 'white', borderRadius: 24, padding: 20, marginTop: 25,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, alignItems: 'center'
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  seeAllText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  recipeScroll: { paddingLeft: 2 },
  recipeCard: { width: width * 0.65, backgroundColor: 'white', borderRadius: 28, marginRight: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, marginBottom: 10 },
  recipeImg: { height: 140, justifyContent: 'center', alignItems: 'center' },
  recipeContent: { padding: 16 },
  matchBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  matchText: { fontSize: 9, fontWeight: '800', color: '#166534' },
  recipeTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8, color: '#1F2937' },

  inventoryList: { marginBottom: 20 },
  invItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, marginBottom: 12 },
  invIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  invName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  invQty: { fontSize: 13, color: '#6B7280' },
  expDate: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  progressCircle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6'
  },

  fab: {
    position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#111827',
    paddingHorizontal: 25, paddingVertical: 16, borderRadius: 30, flexDirection: 'row',
    alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.3
  },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 10, letterSpacing: 0.5 },
  emptyCard: { width: width - 40, height: 100, backgroundColor: '#F3F4F6', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9CA3AF' }
});