import { Platform } from 'react-native';

const DEFAULT_API_URL = 'http://localhost:8000';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

export async function analyzeAudioFile(audioAsset) {
  if (!audioAsset?.uri) {
    throw new Error('No hay audio para analizar.');
  }

  const formData = new FormData();

  if (Platform.OS === 'web') {
    // En la web necesitamos convertir la URI (ya sea blob o data url) en un Blob o Archivo real
    const res = await fetch(audioAsset.uri);
    const blob = await res.blob();
    formData.append('file', blob, audioAsset.name || 'voiceshield-audio.m4a');
  } else {
    // En Android/iOS React Native convierte esto automáticamente en el archivo
    formData.append('file', {
      uri: audioAsset.uri,
      name: audioAsset.name || 'voiceshield-audio.m4a',
      type: audioAsset.type || 'audio/m4a',
    });
  }

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
