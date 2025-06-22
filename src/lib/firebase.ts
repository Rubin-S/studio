import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// IMPORTANT: These values MUST be set in your hosting environment's environment variables.
// The app will not build or run without them.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize db as null
let db: Firestore | null = null;

// Only attempt to initialize if essential config is present
if (firebaseConfig.projectId && firebaseConfig.apiKey) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (error) {
    console.error(
      "Firebase initialization failed. Please check your configuration and environment variables.",
      error
    );
  }
} else {
  // This warning is useful for developers during startup
  console.warn(
    "Firebase Project ID or API Key is missing. The app will run without database functionality. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY."
  );
}


export { db };
