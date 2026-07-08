import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error cargando datos de sesión:', e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const registerUser = async (nombre, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', { nombre, email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error en el servidor.' };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Credenciales incorrectas.' };
    }
  };

  const logoutUser = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};