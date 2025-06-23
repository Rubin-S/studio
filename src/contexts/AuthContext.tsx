
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, UserCredential, updateProfile } from 'firebase/auth';
import { getFirebaseAuth, getDb } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string, name?: string) => Promise<UserCredential>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
        setLoading(false);
        console.warn("Firebase Auth is not initialized.");
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    const auth = getFirebaseAuth();
    if (!auth) return Promise.reject(new Error("Auth not initialized"));
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name?: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Auth not initialized");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Create a student document in Firestore
    try {
        const db = getDb();
        if (db) {
            await setDoc(doc(db, "students", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: name || '',
                createdAt: new Date().toISOString(),
            });
        }
    } catch (firestoreError) {
        // Log the error but don't fail the entire signup process
        console.error("Error creating student document in Firestore:", firestoreError);
    }

    if (name) {
      await updateProfile(user, {
        displayName: name
      });
      // Force a reload of the user to get the new display name
      await userCredential.user.reload();
      // Manually update state to reflect change immediately
      setUser({ ...userCredential.user, displayName: name });
    }
    
    return userCredential;
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
