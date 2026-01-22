import { initializeApp } from "firebase/app";

// import { getReactNativePersistence, initializeAuth } from '@firebase/auth';
import { initializeAuth } from '@firebase/auth';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_Firebase_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_Firebase_AuthDomain,
    projectId: process.env.EXPO_PUBLIC_Firebase_ProjectId,
    storageBucket: process.env.EXPO_PUBLIC_Firebase_StorageBucket,
    messagingSenderId: process.env.EXPO_PUBLIC_Firebase_MessagingSenderId,
    appId: process.env.EXPO_PUBLIC_Firebase_AppId,
    measurementId: process.env.EXPO_PUBLIC_Firebase_MeasurementId
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });



export const auth = initializeAuth(app);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;