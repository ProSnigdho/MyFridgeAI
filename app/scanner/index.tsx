import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Dimensions, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { COLORS } from '../../src/constants/data';

const { width } = Dimensions.get('window');

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true); 
      
      try {
        const photoPromise = cameraRef.current.takePictureAsync({
          quality: 0.4, 
          base64: true,
        });

        router.replace({
          pathname: '/scanner/processing',
          params: { isPending: 'true' } 
        });

        const photo = await photoPromise;

      } catch (error) {
        setIsCapturing(false);
        Alert.alert("Error", "Could not capture photo.");
      }
    }
  };

  if (!permission) return <View style={styles.darkContainer} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="camera-off" size={80} color="#666" />
        <Text style={styles.permissionText}>Camera access is needed to identify your food items.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.grantBtn}>
          <Text style={styles.grantText}>Allow Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.overlay}>
          
          {/* Top Controls */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <Text style={styles.topTitle}>SCAN FOOD</Text>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="flashlight" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* View Finder Frame */}
          <View style={styles.viewFinderContainer}>
            <View style={styles.viewFinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              {isCapturing && <ActivityIndicator size="large" color="white" />}
            </View>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomSection}>
            <Text style={styles.hintText}>Point at ingredients to analyze</Text>
            <TouchableOpacity 
              onPress={takePicture} 
              disabled={isCapturing}
              style={styles.captureOuter}
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
  container: { flex: 1, backgroundColor: '#000' },
  darkContainer: { flex: 1, backgroundColor: '#111' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  topTitle: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  iconBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  viewFinderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewFinder: { width: 260, height: 320, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: 'white', borderWidth: 3 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 15 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 15 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 15 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 15 },
  bottomSection: { paddingBottom: 50, alignItems: 'center' },
  hintText: { color: 'white', marginBottom: 20, fontWeight: '600', fontSize: 14 },
  captureOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 5, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  permissionText: { textAlign: 'center', fontSize: 16, color: '#6B7280', marginVertical: 20 },
  grantBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  grantText: { color: 'white', fontWeight: 'bold' }
});