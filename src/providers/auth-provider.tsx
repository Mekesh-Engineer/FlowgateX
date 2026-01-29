'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// --- Types ---
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'organizer' | 'admin';
  mobile?: string;
  photoURL?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender?: string;
  dob?: string;
  location?: string;
  role: string;
  password: string;
  whatsappOptIn?: boolean;
  marketingOptIn?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start true to check session

  // --- Session Persistence ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch custom profile data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role || 'user',
              mobile: userData.mobile,
            });
          } else {
            // Fallback if firestore doc doesn't exist yet
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'user',
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Actions ---

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged handles setting the user state
    } catch (error: any) {
      setLoading(false);
      // Map Firebase errors to user-friendly messages if needed
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password.');
      }
      throw error;
    }
  };

  // DEPRECATED: Registration now handled by backend API after email OTP verification
  // See: /api/auth/register endpoint
  // Frontend should call otpService.register() instead of this function
  // This function is kept for backward compatibility but should NOT be used
  const register = async (data: RegisterData) => {
    throw new Error(
      'Direct registration is deprecated. Use the email OTP verification flow: ' +
      '1. Call otpService.sendEmailOTP() ' +
      '2. Call otpService.verifyEmailOTP() ' +
      '3. Call otpService.register() with verificationToken ' +
      '4. Call login() to authenticate'
    );
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}