import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de endpoints centrales
export const AUTH_API_URL = 'http://10.1.6.165:3000/api'; 
export const FORENSIC_API_URL = 'http://10.1.6.165:8000';

// Cliente Axios para autenticación y peticiones estándar
const apiClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el JWT si existe
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

/**
 * Verifica el estado de salud del motor de IA
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${FORENSIC_API_URL}/`);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Envía el archivo binario al motor forense de FastAPIs
 */
export const uploadForensicAudio = async (selectedFile, userId) => {
  const formData = new FormData();

  // Compatibilidad nativa e híbrida (Web / Android / iOS)
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

  // Si existe usuario registrado, se anexa para la persistencia relacional
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