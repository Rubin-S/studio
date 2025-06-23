import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Check if all required environment variables are present
const firebaseConfigIsValid =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function getFirebaseApp() {
    if (app) return app;

    if (!firebaseConfigIsValid) {
        console.warn("Firebase configuration is missing or incomplete. Please check your environment variables (e.g., .env.local). Firebase services will be disabled.");
        return null;
    }

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

function getStorageInstance() {
  if (storage) return storage;
  const firebaseApp = getFirebaseApp();
  if (firebaseApp) {
      storage = getStorage(firebaseApp);
      return storage;
  }
  return null;
}

export { getDb, getFirebaseAuth, getStorageInstance };
