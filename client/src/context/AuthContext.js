import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch {
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const toggleFavourite = async (bookId) => {
    if (!user) return;
    try {
      const res = await axios.post(`/api/auth/favourites/${bookId}`);
      setUser(prev => ({ ...prev, favourites: res.data.favourites }));
      return res.data.isFavourite;
    } catch (err) {
      console.error('Toggle favourite error:', err);
    }
  };

  const updateReadingList = async (bookId, status) => {
    if (!user) return;
    try {
      const res = await axios.post(`/api/auth/reading-list/${bookId}`, { status });
      setUser(prev => ({ ...prev, readingList: res.data.readingList }));
    } catch (err) {
      console.error('Reading list error:', err);
    }
  };

  const isFavourite = (bookId) => user?.favourites?.includes(bookId) || false;

  const getReadingStatus = (bookId) => {
    const item = user?.readingList?.find(i => i.bookId === bookId);
    return item?.status || null;
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      toggleFavourite, updateReadingList,
      isFavourite, getReadingStatus,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
