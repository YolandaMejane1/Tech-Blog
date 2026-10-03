import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, googleSignIn, logout } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ask the server who we are (the session lives in an httpOnly cookie we can't read)
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((res) => !cancelled && setUser(res.data.user))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithGoogle = useCallback(async (credential) => {
    const res = await googleSignIn(credential);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  }, []);

  // mirrors the server rule (the server enforces it too): owners and admins only
  const canModify = useCallback(
    (post) => Boolean(user) && (user.role === 'admin' || (Boolean(post.author_id) && post.author_id === user.id)),
    [user]
  );

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signOut, canModify }),
    [user, loading, signInWithGoogle, signOut, canModify]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
