
'use server';

import { getAdminApp, getAdminAuth } from '@/lib/firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';

// Define a consistent user type for the client
export type AuthUser = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  disabled: boolean;
  creationTime: string;
  lastSignInTime: string;
  customClaims: { [key: string]: any } | undefined;
};

// Helper to serialize UserRecord to a plain object
const serializeUserRecord = (user: UserRecord): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  disabled: user.disabled,
  creationTime: user.metadata.creationTime,
  lastSignInTime: user.metadata.lastSignInTime,
  customClaims: user.customClaims,
});

export async function getAllUsers(): Promise<{ users: AuthUser[]; error?: string }> {
  try {
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
        throw new Error('Firebase Admin SDK is not initialized. Please check server environment variables.');
    }

    const userRecords: UserRecord[] = [];
    let pageToken;
    do {
      const listUsersResult = await adminAuth.listUsers(1000, pageToken);
      userRecords.push(...listUsersResult.users);
      pageToken = listUsersResult.pageToken;
    } while (pageToken);

    const users = userRecords.map(serializeUserRecord);
    return { users };
  } catch (error: any) {
    console.error('Error fetching users from Firebase Auth:', error);
    
    let errorMessage = 'An unexpected error occurred while fetching users.';
    if (error.code === 'auth/insufficient-permission' || error.message.includes('Credential implementation')) {
        errorMessage = 'Firebase Admin SDK has insufficient permissions. Ensure your service account has the "Firebase Authentication Admin" role.';
    } else if (error.message.includes('not initialized')) {
        errorMessage = error.message;
    }

    return { users: [], error: errorMessage };
  }
}

export async function updateUserRole(uid: string, role: 'admin' | 'student'): Promise<{ success: boolean; error?: string }> {
    try {
        const adminAuth = getAdminAuth();
        if (!adminAuth) {
            throw new Error('Firebase Admin SDK is not initialized.');
        }

        await adminAuth.setCustomUserClaims(uid, { role });
        return { success: true };
    } catch (error: any) {
        console.error(`Error updating role for user ${uid}:`, error);
        return { success: false, error: 'Failed to update user role.' };
    }
}
