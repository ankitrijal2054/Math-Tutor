import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ⚠️ IMPORTANT: Emulator connections disabled for production backend
// The backend is deployed to Google Cloud Run (production)
// Using emulators would generate tokens incompatible with production verification
//
// If you want to use emulators:
// 1. Deploy functions locally: firebase emulators:start
// 2. Update VITE_CHAT_API_URL to http://localhost:5001
// 3. Uncomment the emulator connections below
// 4. Make sure auth/firestore emulators are running

// Uncomment these lines ONLY if using local emulators:
// if (import.meta.env.DEV) {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099");
//     connectFirestoreEmulator(db, "localhost", 8080);
//     connectStorageEmulator(storage, "localhost", 9199);
//   } catch (e) {
//     console.log("Emulators already initialized");
//   }
// }

// Set persistence
setPersistence(auth, browserLocalPersistence);

export default app;
