import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_Firebase_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_Firebase_AuthDomain,
  projectId: process.env.EXPO_PUBLIC_Firebase_ProjectId,
  storageBucket: process.env.EXPO_PUBLIC_Firebase_StorageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_Firebase_MessagingSenderId,
  appId: process.env.EXPO_PUBLIC_Firebase_AppId,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
