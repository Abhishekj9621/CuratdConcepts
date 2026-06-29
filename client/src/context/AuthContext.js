import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, clearToken, adminLogin, adminMe } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, check if we have a stored token that's still valid
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    adminMe()
      .then((res) => setAdmin(res.admin))
      .catch(() => {
        clearToken();
        setAdmin(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await adminLogin(username, password);
    setToken(res.token);
    setAdmin(res.admin);
    return res;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAdmin(null);
  }, []);

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
