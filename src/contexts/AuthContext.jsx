import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const AuthContext = createContext();




export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [role, setRole] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          if (currentUser) {
            setUser(currentUser);
            setUid(currentUser.uid);
            // Fetch user role from database
            const userRef = ref(db, `users/${currentUser.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setRole(userData.role);
              setFullName(userData.fullName);
            } else {
              setRole(null);
              setFullName(null);
            }
            setError(null);
          } else {
            setUser(null);
            setUid(null);
            setRole(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth listener error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  

  const value = {
    user,
    uid,
    role,
    fullName,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
