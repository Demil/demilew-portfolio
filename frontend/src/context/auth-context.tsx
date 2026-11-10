'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, getMe, loginAdmin, logoutAdmin, setupInitialAdmin } from '@/lib/auth';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setup: (email: string, pass: string) => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAdmin = async () => {
    try {
      const user = await getMe();
      setAdmin(user);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdmin();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await loginAdmin(email, pass);
    setAdmin(res.user);
  };

  const logout = async () => {
    await logoutAdmin();
    setAdmin(null);
  };

  const setup = async (email: string, pass: string) => {
    const created = await setupInitialAdmin(email, pass);
    // After setup, automatically log in
    await login(email, pass);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, setup, refreshAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

