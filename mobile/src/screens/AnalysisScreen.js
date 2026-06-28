import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RecordingPresets,
  pickAudioDocument,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioPlayer,
  useAudioPlayerStatus,
} from '../services/audio';
import { analyzeAudioFile } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import InfoCard from '../components/InfoCard';
import { colors, spacing } from '../theme';

export default function AnalysisScreen({ navigation }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('Solicitando permisos...');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  const player = useAudioPlayer(selectedAudio?.uri);
  const playerStatus = useAudioPlayerStatus(player);

  const recorderTimeLabel = useMemo(() => {
    const minutes = Math.floor(recordedSeconds / 60);
    const seconds = Math.floor(recordedSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [recordedSeconds]);

  useEffect(() => {
    let alive = true;

    const setupRecorder = async () => {
      try {
        const permission = await requestRecordingPermissionsAsync();
        if (!alive) {
          return;
        }

        if (!permission.granted) {
          setPermissionStatus('El permiso de micrófono fue denegado.');
          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        await recorder.prepareToRecordAsync();
        if (alive) {
          setPermissionStatus('Micrófono listo para grabar.');
          setIsReady(true);
        }
      } catch (error) {
        if (alive) {
          setPermissionStatus('No se pudo preparar el micrófono.');
        }
      }
    };

    setupRecorder();

    return () => {
      alive = false;
      if (recorder.isRecording) {
        recorder.stop().catch(() => {});
      }
    };
  }, [recorder]);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordedSeconds((value) => value + 1);
      }, 1000);
    } else {
      setRecordedSeconds(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRecording]);

  const handleRecordToggle = async () => {
    try {
      if (isRecording) {
        await recorder.stop();
        setIsRecording(false);
        const uri = recorder.uri;
        if (uri) {
          setSelectedAudio({
            uri,
            name: `grabacion-${Date.now()}.m4a`,
            type: 'audio/m4a',
            source: 'Grabación',
          });
        }
        return;
      }

      if (!isReady) {
        await recorder.prepareToRecordAsync();
      }

      await recorder.record();
      setIsRecording(true);
      setSelectedAudio(null);
    } catch (error) {
      Alert.alert('Grabación', 'No fue posible iniciar o detener la grabación.');
    }
  };

  const handlePickAudio = async () => {
    try {
      const asset = await pickAudioDocument();
      if (asset) {
        setSelectedAudio(asset);
        setIsRecording(false);
      }
    } catch (error) {
      Alert.alert('Archivos', 'No fue posible seleccionar el audio.');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedAudio?.uri) {
      Alert.alert('Audio faltante', 'Primero graba o selecciona un archivo de audio.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await analyzeAudioFile(selectedAudio);
      navigation.navigate('Resultados', {
        result,
        audioLabel: selectedAudio.source,
        audioUri: selectedAudio.uri,
      });
    } catch (error) {
      Alert.alert(
        'Análisis fallido',
        error.message || 'Revisa que el backend esté activo y que EXPO_PUBLIC_API_URL sea correcto.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <InfoCard
          title="Captura de audio"
          subtitle="Usa el micrófono del dispositivo o importa un archivo almacenado localmente."
          accent={colors.cyan}
        >
          <Text style={styles.status}>{permissionStatus}</Text>
          <Text style={styles.helper}>
            El audio seleccionado se enviará al backend en formato `multipart/form-data`.
          </Text>
        </InfoCard>

        <View style={styles.actions}>
          <PrimaryButton
            label={isRecording ? `Detener grabación (${recorderTimeLabel})` : 'Grabar audio'}
            onPress={handleRecordToggle}
            disabled={!isReady && !isRecording}
            tone="green"
          />
          <PrimaryButton label="Seleccionar archivo de audio" onPress={handlePickAudio} tone="yellow" />
        </View>

        <InfoCard
          title="Audio listo"
          subtitle={selectedAudio ? 'Ya hay una fuente preparada para el análisis.' : 'Todavía no has seleccionado audio.'}
          accent={selectedAudio ? colors.green : colors.yellow}
        >
          {selectedAudio ? (
            <View style={styles.selectionBox}>
              <Text style={styles.selectionTitle}>{selectedAudio.source}</Text>
              <Text style={styles.selectionText}>{selectedAudio.name}</Text>
              <Text style={styles.selectionText} numberOfLines={1}>
                {selectedAudio.uri}
              </Text>
              <View style={{ marginTop: 10 }}>
                <PrimaryButton 
                  label={playerStatus.playing ? 'Pausar Audio' : 'Reproducir Audio'} 
                  onPress={() => {
                    if (playerStatus.playing) {
                      player.pause();
                    } else {
                      player.play();
                    }
                  }} 
                  tone="cyan"
                />
              </View>
            </View>
          ) : (
            <View style={styles.selectionEmpty}>
              <Text style={styles.selectionEmptyText}>Selecciona un archivo o crea una grabación nueva.</Text>
            </View>
          )}
        </InfoCard>

        <View style={styles.bottomBlock}>
          <PrimaryButton
            label={isSubmitting ? 'Analizando...' : 'Analizar Audio'}
            onPress={handleAnalyze}
            disabled={isSubmitting || !selectedAudio}
          />
          {isSubmitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.cyan} />
              <Text style={styles.loadingText}>Enviando audio al servidor y procesando respuesta.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  status: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  helper: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  selectionBox: {
    gap: 6,
    backgroundColor: '#0B1324',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  selectionText: {
    color: colors.muted,
    fontSize: 13,
  },
  selectionEmpty: {
    paddingVertical: 10,
  },
  selectionEmptyText: {
    color: colors.muted,
    fontSize: 14,
  },
  bottomBlock: {
    gap: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
