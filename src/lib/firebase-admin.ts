
import * as admin from 'firebase-admin';

// These variables are only available in the server environment
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

let adminApp: admin.app.App | null = null;
let adminAuth: admin.auth.Auth | null = null;

function initializeAdminApp() {
  if (!serviceAccount) {
    console.warn('Firebase Admin SDK service account credentials are not set. Admin features will be disabled. Please set the FIREBASE_SERVICE_ACCOUNT environment variable.');
    return null;
  }

  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization failed:', error);
    return null;
  }
}

export function getAdminApp() {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}

export function getAdminAuth() {
  if (!adminAuth) {
    const app = getAdminApp();
    if (app) {
      adminAuth = app.auth();
    }
  }
  return adminAuth;
}
