import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_API_URL = 'http://192.168.100.7:3000/api'; 
// =========================================================================
// ¡IMPORTANTE!: Recuerda cambiar esta URL por la URL activa que te dé tu consola de Ngrok
export const FORENSIC_API_URL = 'https://guidable-sierra-renovator.ngrok-free.dev'; 
// =========================================================================

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

export const uploadForensicAudio = async (selectedFile, userId, origen = 'whatsapp', telegramChatId = null) => {
  const formData = new FormData();

  // Restauración del empaquetador dinámico multipart verificado para Android
  if (
    selectedFile.uri.startsWith('blob:') ||
    selectedFile.uri.startsWith('data:') ||
    selectedFile.uri.startsWith('http')
  ) {
    const responseFile = await fetch(selectedFile.uri);
    const fileData = await responseFile.blob();
    formData.append('file', fileData, selectedFile.name || 'audio.ogg');
  } else {
    formData.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name || 'audio.ogg',
      type: selectedFile.mimeType || 'audio/ogg',
    });
  }

  if (userId) {
    formData.append('usuario_id', String(userId));
  }
  
  if (origen) {
    formData.append('tipo_origen', origen);
  }
  
  if (telegramChatId) {
    formData.append('telegram_chat_id', String(telegramChatId));
  }

  try {
    const response = await fetch(`${FORENSIC_API_URL}/api/v1/analisis/forense`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Control pericial de cabeceras para interceptar HTML de Ngrok y frenar la pantalla gris
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('El túnel Ngrok devolvió una respuesta web inválida. Comprueba que tu terminal de comandos no se haya cerrado o pausado en el puerto 8000.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Fallo en la comunicación con los motores periciales.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error crítico de conexión de red con el servidor de FastAPI.');
  }
};

export default apiClient;