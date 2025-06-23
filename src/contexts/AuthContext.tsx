
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<UserCredential>;
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

  const signup = (email: string, pass: string) => {
    const auth = getFirebaseAuth();
    if (!auth) return Promise.reject(new Error("Auth not initialized"));
    return createUserWithEmailAndPassword(auth, email, pass);
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
