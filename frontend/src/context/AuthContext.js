import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('flashpulse_token'));
  const [loading, setLoading] = useState(true);

  const api = useCallback(() => {
    return axios.create({
      baseURL: API,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api().get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('flashpulse_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token, api]);

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { access_token, user: userData } = response.data;
    localStorage.setItem('flashpulse_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, username) => {
    const response = await axios.post(`${API}/auth/register`, { email, password, username });
    const { access_token, user: userData } = response.data;
    localStorage.setItem('flashpulse_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('flashpulse_token');
    setToken(null);
    setUser(null);
  };

  const addFavoriteTeam = async (teamId) => {
    await api().post(`/favorites/teams/${teamId}`);
    setUser(prev => ({
      ...prev,
      favorite_teams: [...(prev.favorite_teams || []), teamId]
    }));
  };

  const removeFavoriteTeam = async (teamId) => {
    await api().delete(`/favorites/teams/${teamId}`);
    setUser(prev => ({
      ...prev,
      favorite_teams: (prev.favorite_teams || []).filter(id => id !== teamId)
    }));
  };

  const isFavoriteTeam = (teamId) => {
    return user?.favorite_teams?.includes(teamId) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      api,
      addFavoriteTeam,
      removeFavoriteTeam,
      isFavoriteTeam,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
