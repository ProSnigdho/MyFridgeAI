import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/data';
import { scanImageWithGemini } from '../../src/services/aiService';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);   
  const [loading, setLoading] = useState(false);

  // ছবি তোলা এবং AI দিয়ে এনালাইসিস করার ফাংশন
  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      try {
        setLoading(true);
        
        // ছবি ক্যাপচার (Base64 ফরম্যাটে কারণ Gemini এটি গ্রহণ করে)
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5, 
          base64: true,
        });

        if (photo && photo.base64) {
          // AI Service কল করা (aiService.ts এ গিয়ে Gemini API হিট করবে)
          const detectedItems = await scanImageWithGemini(photo.base64);

          if (detectedItems && detectedItems.length > 0) {
            console.log("AI Detected Items:", detectedItems);
            
            // ডাটা সফলভাবে পাওয়া গেলে Inventory পেজে পাঠিয়ে দেয়া
            // সেখানে useEffect এই ডাটাগুলো অটোমেটিক Firebase-এ সেভ করে নেবে
            router.replace({
              pathname: '/(tabs)/inventory',
              params: { newItems: JSON.stringify(detectedItems) }
            });
          } else {
            Alert.alert("Detection Failed", "AI could not identify food. Try a clearer angle.");
          }
        }
      } catch (error) {
        console.error("Capture Error:", error);
        Alert.alert("Error", "Something went wrong while scanning the image.");
      } finally {
        setLoading(false);
      }
    }
  };

  // পারমিশন চেক
  if (!permission) return <View style={styles.center} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={60} color={COLORS.gray} />
        <Text style={styles.permissionText}>We need camera access to scan your fridge</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.overlay}>
          
          {/* Close Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          
          {/* Visual Scan Frame */}
          <View style={styles.scanContainer}>
            <View style={[
              styles.scanFrame, 
              loading && { borderColor: COLORS.secondary, borderStyle: 'solid' }
            ]} />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS.secondary} />
                <Text style={styles.loadingText}>AI is analyzing your food...</Text>
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomBar}>
            {!loading && <Text style={styles.instruction}>Point at food items to scan</Text>}
            
            <TouchableOpacity 
              style={[styles.captureBtn, loading && { opacity: 0.5 }]} 
              onPress={takePicture} 
              disabled={loading}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>

        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { textAlign: 'center', marginVertical: 20, fontSize: 16, color: COLORS.gray },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: 30 },
  closeBtn: { marginTop: 20, alignSelf: 'flex-start' },
  scanContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { 
    width: 280, 
    height: 350, 
    borderWidth: 2, 
    borderColor: 'white', 
    borderRadius: 30, 
    borderStyle: 'dashed' 
  },
  loadingOverlay: { 
    position: 'absolute', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    padding: 20, 
    borderRadius: 20 
  },
  loadingText: { color: 'white', marginTop: 10, fontWeight: 'bold' },
  bottomBar: { alignItems: 'center', marginBottom: 20 },
  instruction: { color: 'white', marginBottom: 20, fontSize: 16, fontWeight: '500', textAlign: 'center', textShadowColor: 'black', textShadowRadius: 2 },
  captureBtn: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 5, 
    borderColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, marginTop: 10 }
});