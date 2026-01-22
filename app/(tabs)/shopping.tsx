import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/data';
import { auth, db } from '../../src/services/firebase';

const FOOD_SUGGESTIONS = [
  "Apple", "Banana", "Milk", "Eggs", "Chicken", "Beef", "Fish", "Rice",
  "Potato", "Tomato", "Onion", "Garlic", "Ginger", "Green Chili", "Coriander",
  "Bread", "Butter", "Cheese", "Yogurt", "Flour", "Sugar", "Salt", "Oil", "Tea"
];

export default function ShoppingScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const userUid = auth.currentUser?.uid;

  
  useEffect(() => {
    if (!userUid) return;
    const q = query(collection(db, 'users', userUid, 'shoppingList'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userUid]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const filtered = FOOD_SUGGESTIONS.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addItem = async (name: string) => {
    if (!userUid || name.trim() === '') return;
    try {
      await addDoc(collection(db, 'users', userUid, 'shoppingList'), {
        name: name,
        checked: false,
        createdAt: serverTimestamp()
      });
      setSearchText('');
      setSuggestions([]);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Add Error:", error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!userUid || !id) return;

    const performDelete = async () => {
      try {
        const itemRef = doc(db, 'users', userUid, 'shoppingList', id);
        await deleteDoc(itemRef);
        console.log("Success: Item deleted");
      } catch (error) {
        console.error("Delete Error:", error);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete this item?");
      if (confirmed) await performDelete();
    } else {
      Alert.alert(
        "Remove Item",
        "Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  const toggleCheck = async (id: string, item: any) => {
    if (!userUid || !id) return;
    
    const itemRef = doc(db, 'users', userUid, 'shoppingList', id);
    const newCheckedStatus = !item.checked;

    try {
      
      await updateDoc(itemRef, { checked: newCheckedStatus });

      
      if (newCheckedStatus) {
        await addDoc(collection(db, 'users', userUid, 'inventory'), {
          name: item.name || "Unknown Item",
          qty: '1 unit',
          expiry: '7 days',
          progress: 1.0,
          color: COLORS.primary,
          createdAt: serverTimestamp()
        });
        console.log("Item moved to Inventory!");
      }
    } catch (error) {
      console.error("Sync Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>

      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.input}
            placeholder="Search & Add Food..."
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={() => addItem(searchText)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => addItem(searchText)} style={styles.addBtnInside}>
              <Ionicons name="add-circle" size={30} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => addItem(suggestion)}
              >
                <Ionicons name="fast-food-outline" size={18} color={COLORS.primary} />
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Ionicons name="add" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {items.map(item => (
            <View key={item.id} style={styles.row}>
              <TouchableOpacity
                style={[styles.check, item.checked && { backgroundColor: COLORS.primary }]}
                
                onPress={() => toggleCheck(item.id, item)}
              >
                {item.checked && <Ionicons name="checkmark" size={16} color="white" />}
              </TouchableOpacity>

              <Text style={[styles.name, item.checked && { textDecorationLine: 'line-through', color: COLORS.gray }]}>
                {item.name}
              </Text>

              <TouchableOpacity
                onPress={() => deleteItem(item.id)}
                style={styles.deleteBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={22} color="#FF4444" />
              </TouchableOpacity>
            </View>
          ))}

          {items.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>Your list is empty</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 15, color: '#333' },
  searchContainer: { zIndex: 100, marginBottom: 10 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
    height: 55
  },
  input: { flex: 1, paddingHorizontal: 15, fontSize: 16 },
  addBtnInside: { marginRight: 10 },
  suggestionBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    zIndex: 999
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  suggestionText: { flex: 1, marginLeft: 10, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8'
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: { flex: 1, fontSize: 17, color: '#444', fontWeight: '500' },
  deleteBtn: {
    padding: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#BBB', marginTop: 10, fontSize: 16 }
});