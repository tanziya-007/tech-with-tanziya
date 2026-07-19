'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AdminContextType = {
  isAdmin: boolean;
  token: string | null;
  requestOtp: (email: string) => Promise<{ success: boolean; error?: string; expiresIn?: number }>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  handleAuthError: (status: number) => void;
  mounted: boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    if (stored) {
      setToken(stored);
      setIsAdmin(true);
    }
    setMounted(true);
  }, []);

  const requestOtp = async (email: string): Promise<{ success: boolean; error?: string; expiresIn?: number }> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }
      return { success: true, expiresIn: data.expiresIn };
    } catch {
      return { success: false, error: 'Network error while requesting OTP' };
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      if (!res.ok) return false;
      const { token } = await res.json();
      setToken(token);
      setIsAdmin(true);
      localStorage.setItem('adminToken', token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleAuthError = (status: number) => {
    if (status === 401) logout();
  };

  return (
    <AdminContext.Provider value={{ isAdmin, token, requestOtp, verifyOtp, logout, handleAuthError, mounted }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) return { isAdmin: false, token: null, requestOtp: async () => ({ success: false }), verifyOtp: async () => false, logout: () => {}, handleAuthError: () => {}, mounted: false };
  return context;
}
