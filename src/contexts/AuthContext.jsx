import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase.config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          setUid(currentUser.uid);
          const snapshot = await get(ref(db, `users/${currentUser.uid}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setRole(userData.role);
            setFullName(userData.fullName);
          }
        } else {
          setUser(null);
          setUid(null);
          setRole(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
      throw err;
    }
  };

  const value = {
    user,
    uid,
    role,
    fullName,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);