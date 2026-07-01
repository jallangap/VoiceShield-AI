import { Platform } from 'react-native';

const DEFAULT_API_URL = 'http://localhost:8000';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

export async function analyzeAudioFile(audioAsset) {
  if (!audioAsset?.uri) {
    throw new Error('No hay audio para analizar.');
  }

  const formData = new FormData();

  // 1. Validación dinámica del tipo MIME (Corrección sugerida por Claude)
  // Evaluamos las propiedades comunes que devuelven los pickers y grabadoras de Expo
  let detectedMimeType = audioAsset.mimeType || audioAsset.type;
  
  // Si no se detecta un tipo string válido o viene genérico, lo deducimos por la extensión del archivo
  if (!detectedMimeType || typeof detectedMimeType !== 'string' || !detectedMimeType.includes('/')) {
    const fileUri = audioAsset.uri.toLowerCase();
    if (fileUri.endsWith('.mp3')) {
      detectedMimeType = 'audio/mp3';
    } else if (fileUri.endsWith('.wav')) {
      detectedMimeType = 'audio/wav';
    } else {
      detectedMimeType = 'audio/x-m4a'; // Fallback estándar: Expo graba nativamente en este contenedor
    }
  }

  // 2. Construcción del FormData según la plataforma
  if (Platform.OS === 'web') {
    // En la web necesitamos convertir la URI (ya sea blob o data url) en un Blob o Archivo real
    const res = await fetch(audioAsset.uri);
    const blob = await res.blob();
    formData.append('file', blob, audioAsset.name || 'voiceshield-audio.m4a');
  } else {
    // En Android/iOS React Native convierte esto automáticamente en el archivo físico
    formData.append('file', {
      uri: audioAsset.uri,
      name: audioAsset.name || 'voiceshield-audio.m4a',
      type: detectedMimeType, // Enviamos el tipo verificado con éxito
    });
  }

  // 3. Petición HTTP al backend asíncrono
  const response = await fetch(`${API_URL}/analyze-audio`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'No fue posible analizar el audio.');
  }

  return response.json();
}