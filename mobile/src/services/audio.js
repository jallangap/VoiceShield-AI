import * as DocumentPicker from 'expo-document-picker';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus };

export async function pickAudioDocument() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    multiple: false,
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return null;
  }

  const [asset] = result.assets;
  return {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType || 'audio/*',
    size: asset.size,
    source: 'Archivo',
  };
}
