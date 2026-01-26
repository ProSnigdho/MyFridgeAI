import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../src/constants/data';
import { scanImageWithGemini } from '../../src/services/aiService';

export default function ProcessingScreen() {
  const { imageBase64 } = useLocalSearchParams();
  const router = useRouter();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const analyze = async () => {
      try {
        if (!imageBase64) {
          router.back();
          return;
        }

        const detectedItems = await scanImageWithGemini(imageBase64 as string);

        if (detectedItems && detectedItems.length > 0) {
          router.replace({
            pathname: '/inventory',
            params: { newItems: JSON.stringify(detectedItems) }
          });
        } else {
          alert("AI couldn't see any food. Try again!");
          router.back();
        }
      } catch (error) {
        console.error(error);
        router.back();
      }
    };

    analyze();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.mainBox}>
        <Animated.View style={[styles.loaderRing, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <MaterialCommunityIcons name="brain" size={60} color={COLORS.primary} />
        </Animated.View>
      </View>

      <Text style={styles.title}>AI Analysis</Text>
      <Text style={styles.subtitle}>Our AI Chef is scanning the image to identify ingredients and quantity.</Text>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>PROCESSING IMAGE...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 40 },
  mainBox: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  loaderRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
    borderStyle: 'dashed',
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  statusBadge: { marginTop: 40, backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 }
});