import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'ADMIN' | 'ATTORNEY' | 'PARALEGAL' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('auth_token');
    const storedUser = window.localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    window.localStorage.setItem('auth_token', t);
    window.localStorage.setItem('auth_user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
