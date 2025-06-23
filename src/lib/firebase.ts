import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC5cc0x0sqatUH_llMlJj19KtgPpCJR-Q4",
  authDomain: "smds-2025-bbf18.firebaseapp.com",
  projectId: "smds-2025-bbf18",
  storageBucket: "smds-2025-bbf18.firebasestorage.app",
  messagingSenderId: "496888994029",
  appId: "1:496888994029:web:2cca2e24f840f3386754e4",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseApp() {
    if (app) return app;

    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        return app;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return null;
    }
}


function getDb() {
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  if (firebaseApp) {
      db = getFirestore(firebaseApp);
      return db;
  }
  return null;
}

function getFirebaseAuth() {
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  if (firebaseApp) {
      auth = getAuth(firebaseApp);
      return auth;
  }
  return null;
}

export { getDb, getFirebaseAuth };
