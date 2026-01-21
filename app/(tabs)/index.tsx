import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, MOCK_INVENTORY, MOCK_RECIPES } from '../../src/constants/data'



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
      <Text style={styles.itemQty}>{item.qty}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
      </View>
    </View>
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={[styles.expiryText, { color: item.color }]}>{item.expiry}</Text>
      <Text style={{ fontSize: 10, color: COLORS.gray }}>left</Text>
    </View>
  </View>
);

// --- Main Screen ---

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Sarah! 👋</Text>
            <Text style={styles.subtitle}>Check your fridge items</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
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
          <StatCard label="Items" count="24" icon="fridge-outline" color={COLORS.primary} />
          <StatCard label="Expiring" count="03" icon="clock-alert-outline" color={COLORS.danger} />
        </View>

        {/* Inventory Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Inventory</Text>
          <TouchableOpacity onPress={() => router.push('/inventory')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {MOCK_INVENTORY.map(item => (
          <InventoryItem key={item.id} item={item} />
        ))}

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

      {/* Floating Action Button (Scanner) */}
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
  iconBtn: { backgroundColor: 'white', padding: 10, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, marginTop: 25, height: 50, elevation: 1 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  statCard: { width: '48%', padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center' },
  statCount: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.gray },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  seeAll: { color: COLORS.primary, fontWeight: '600' },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03 },
  itemIconBox: { width: 48, height: 48, backgroundColor: '#F2FFF7', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  itemQty: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  progressContainer: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginTop: 8, width: '90%' },
  progressBar: { height: 6, borderRadius: 3 },
  expiryText: { fontSize: 13, fontWeight: 'bold' },
  recipeList: { marginBottom: 20 },
  recipeCard: { width: 160, backgroundColor: 'white', borderRadius: 22, padding: 10, marginRight: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  recipeImage: { width: '100%', height: 100, borderRadius: 18 },
  matchBadge: { backgroundColor: '#E8F8F5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  matchText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  recipeTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8, color: COLORS.text },
  recipeTime: { fontSize: 11, color: COLORS.gray, marginLeft: 4 },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: COLORS.primary, paddingHorizontal: 22, paddingVertical: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center', elevation: 8, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10 },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
});