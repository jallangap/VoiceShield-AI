import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de endpoints centrales
export const AUTH_API_URL = 'http://192.168.100.7:3000/api'; 
export const FORENSIC_API_URL = 'http://192.168.100.7:8000';

const apiClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${FORENSIC_API_URL}/`);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 */
export const uploadForensicAudio = async (selectedFile, userId) => {
  const formData = new FormData();

  if (
    selectedFile.uri.startsWith('blob:') ||
    selectedFile.uri.startsWith('data:') ||
    selectedFile.uri.startsWith('http')
  ) {
    const responseFile = await fetch(selectedFile.uri);
    const fileData = await responseFile.blob();
    formData.append('file', fileData, selectedFile.name || 'audio.wav');
  } else {
    formData.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name || 'audio.wav',
      type: selectedFile.mimeType || 'audio/wav',
    });
  }

  if (userId) {
    formData.append('usuario_id', String(userId));
  }

  const response = await fetch(`${FORENSIC_API_URL}/api/v1/analisis/forense`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData.detail || errorData));
  }

  return await response.json();
};

export default apiClient;