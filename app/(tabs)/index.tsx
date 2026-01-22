import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, MOCK_RECIPES } from '../../src/constants/data';
import { auth, db } from '../../src/services/firebase';

// --- Sub-Components ---

const StatCard = ({ label, count, icon, color }: any) => (
  <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
    <MaterialCommunityIcons name={icon} size={24} color={color} />
    <View style={{ marginLeft: 10 }}>
      <Text style={[styles.statCount, { color: color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const InventoryItem = ({ item }: any) => (
  <View style={styles.itemCard}>
    <View style={styles.itemIconBox}>
      <MaterialCommunityIcons name="food-apple" size={24} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1, marginHorizontal: 15 }}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQty}>{item.qty || '1 unit'}</Text>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(item.progress || 0.5) * 100}%`,
              backgroundColor: item.color || COLORS.primary
            }
          ]}
        />
      </View>
    </View>
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={[styles.expiryText, { color: item.color || COLORS.text }]}>
        {item.expiry || 'N/A'}
      </Text>
      <Text style={{ fontSize: 10, color: COLORS.gray }}>left</Text>
    </View>
  </View>
);

// --- Main Screen ---

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, expiring: 0 });

  useEffect(() => {
    // ১. ইউজারের ডিসপ্লে নেম সেট করা
    if (auth.currentUser?.displayName) {
      setUserName(auth.currentUser.displayName);
    }

    // ২. Firestore থেকে রিয়েল-টাইম ডাটা লিসেন করা
    const userUid = auth.currentUser?.uid;
    if (userUid) {
      const inventoryRef = collection(db, 'users', userUid, 'inventory');

      // হোমের জন্য লেটেস্ট ৫টি আইটেম
      const q = query(inventoryRef, limit(5));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInventory(items);
        setStats({
          total: snapshot.size,
          expiring: items.filter((i: any) => i.progress < 0.3).length // উদাহরণ লজিক
        });
        setLoading(false);
      }, (error) => {
        console.error("Firestore Error: ", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
            <Text style={styles.subtitle}>Check your fridge items</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="person-circle-outline" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={{ marginLeft: 15 }} />
          <TextInput
            placeholder="Search ingredients..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard label="Items" count={stats.total.toString()} icon="fridge-outline" color={COLORS.primary} />
          <StatCard label="Expiring" count={stats.expiring.toString()} icon="clock-alert-outline" color={COLORS.danger} />
        </View>

        {/* Inventory Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Inventory</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/inventory')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : inventory.length > 0 ? (
          inventory.map(item => (
            <InventoryItem key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="fridge-off-outline" size={50} color={COLORS.gray} />
            <Text style={styles.emptyText}>Your fridge is empty!</Text>
            <Text style={styles.emptySubText}>Scan items to fill it up.</Text>
          </View>
        )}

        {/* Recipes Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Smart Recipes</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeList}>
          {MOCK_RECIPES.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
            >
              <View style={[styles.recipeImage, { backgroundColor: recipe.color }]} />
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{recipe.match} Match</Text>
              </View>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Ionicons name="time-outline" size={12} color={COLORS.gray} />
                <Text style={styles.recipeTime}>{recipe.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/scanner')}
        activeOpacity={0.8}
      >
        <Ionicons name="scan" size={28} color="white" />
        <Text style={styles.fabText}>SCAN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  iconBtn: { backgroundColor: 'white', padding: 8, borderRadius: 12, elevation: 2 },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, marginTop: 25, height: 50, elevation: 1 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  statCard: { width: '48%', padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center' },
  statCount: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.gray },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  seeAll: { color: COLORS.primary, fontWeight: '600' },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 2 },
  itemIconBox: { width: 48, height: 48, backgroundColor: '#F2FFF7', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  itemQty: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  progressContainer: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginTop: 8, width: '90%' },
  progressBar: { height: 6, borderRadius: 3 },
  expiryText: { fontSize: 13, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginVertical: 30 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 10 },
  emptySubText: { fontSize: 14, color: COLORS.gray },
  recipeList: { marginBottom: 20 },
  recipeCard: { width: 160, backgroundColor: 'white', borderRadius: 22, padding: 10, marginRight: 15, elevation: 3 },
  recipeImage: { width: '100%', height: 100, borderRadius: 18 },
  matchBadge: { backgroundColor: '#E8F8F5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  matchText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  recipeTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8, color: COLORS.text },
  recipeTime: { fontSize: 11, color: COLORS.gray, marginLeft: 4 },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: COLORS.primary, paddingHorizontal: 22, paddingVertical: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center', elevation: 8 },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
});