import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
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
