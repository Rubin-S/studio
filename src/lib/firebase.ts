import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: Firestore | null = null;

function getDb() {
  if (db) {
    return db;
  }

  if (firebaseConfig.projectId && firebaseConfig.apiKey) {
    try {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
      return db;
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      return null;
    }
  } else {
    console.warn("Firebase config is missing, database will not be available.");
    return null;
  }
}

export { getDb };
