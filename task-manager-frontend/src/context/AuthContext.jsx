import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ledger_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, confirm it's still valid and refresh
  // the user profile rather than trusting stale localStorage data blindly.
  useEffect(() => {
    const token = localStorage.getItem('ledger_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.data);
        localStorage.setItem('ledger_user', JSON.stringify(data.data));
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token, ...profile } = data.data;
    localStorage.setItem('ledger_token', token);
    localStorage.setItem('ledger_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    const { token, ...profile } = data.data;
    localStorage.setItem('ledger_token', token);
    localStorage.setItem('ledger_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ledger_token');
    localStorage.removeItem('ledger_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
