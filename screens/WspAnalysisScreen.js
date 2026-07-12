import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import { uploadForensicAudio } from '../services/api';

export default function WspAnalysisScreen({
  setCurrentScreen,
  currentScreen,
  handleLogout,
  userId,
  isGuest,
  audioAnalizedCount,
  setAudioAnalizedCount,
  setAnalysisResultGlobal
}) {
  const [telegramId, setTelegramId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [localResult, setLocalResult] = useState(null);
  const [showRouteHelp, setShowRouteHelp] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Escuchar enlaces profundos de retorno
  useEffect(() => {
    const handleDeepLink = (event) => {
      if (event.url) analizarUrlRetorno(event.url);
    };

    Linking.getInitialURL().then((url) => {
      if (url) analizarUrlRetorno(url);
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const analizarUrlRetorno = async (url) => {
    try {
      if (url.includes('tgid=')) {
        const idDetectado = url.split('tgid=')[1].split('&')[0];
        if (idDetectado) {
          setTelegramId(idDetectado);
          await AsyncStorage.setItem('telegramChatId', idDetectado);
          Alert.alert('¡Sincronizado!', 'Canal de auditoría pericial de Telegram configurado con éxito.');
        }
      }
    } catch (error) {
      console.error('Error en deep link de retorno:', error);
    }
  };

  // Cargar ID de respaldo de la memoria local
  useEffect(() => {
    const loadTelegramId = async () => {
      try {
        const savedId = await AsyncStorage.getItem('telegramChatId');
        if (savedId) setTelegramId(savedId);
      } catch (error) {
        console.error('Error al cargar Telegram ID:', error);
      }
    };
    loadTelegramId();
  }, []);

  const handleSaveManualId = async (id) => {
    setTelegramId(id);
    try {
      await AsyncStorage.setItem('telegramChatId', id);
    } catch (error) {
      console.error('Error al guardar ID manual:', error);
    }
  };

  const handleLinkTelegram = async () => {
    try {
      const url = 'https://t.me/GuardIAnCriticBot';
      const soportaUrl = await Linking.canOpenURL(url);
      if (soportaUrl) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Atención', 'No se pudo abrir Telegram de forma directa. Por favor busca al bot manualmente en la app como: @GuardIAnCriticBot');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió una anomalía al intentar invocar la aplicación externa de Telegram.');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType || 'audio/ogg',
        });
        setLocalResult(null); 
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo multimedia.');
    }
  };

  const uploadWspAudio = async () => {
    if (!selectedFile) {
      Alert.alert('Atención', 'Por favor selecciona un audio multimedia primero.');
      return;
    }

    if (isGuest && audioAnalizedCount >= 1) {
      Alert.alert("Límite alcanzado", "Has alcanzado el límite de uso para usuarios invitados.");
      return;
    }

    const mensajesModelos = [
      "Extrayendo archivo multimedia...",
      "Analizando acústica forense...",
      "Evaluando rasgos lingüísticos...",
      "Consolidando reporte en pantalla..."
    ];

    let index = 0;
    setLoading(true);
    setLoadingStatus(mensajesModelos[index]);

    const intervalId = setInterval(() => {
      index = (index + 1) % mensajesModelos.length;
      setLoadingStatus(mensajesModelos[index]);
    }, 2500);

    try {
      const telegramIdToSend = telegramId ? telegramId : null;
      const data = await uploadForensicAudio(selectedFile, userId, 'whatsapp', telegramIdToSend);
      
      setLocalResult(data);
      if (setAnalysisResultGlobal) setAnalysisResultGlobal(data);
      setAudioAnalizedCount(prev => prev + 1);

      Alert.alert("Análisis Exitoso", "El diagnóstico pericial se ha renderizado abajo.");
    } catch (error) {
      console.error(error);
      Alert.alert('Fallo de Comunicación', error.message || 'Ocurrió un error al contactar al servidor de FastAPI.');
    } finally {
      clearInterval(intervalId);
      setLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER CORREGIDO CONTRA DESBORDAMIENTOS EN PANTALLAS REDMI */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
          <Ionicons name="shield-checkmark-sharp" size={24} color="#D62828" />
          <Text style={styles.title} numberOfLines={1}>Módulo Audios</Text>
        </View>
        
        <View style={[styles.miniBadge, { 
          borderColor: telegramId ? '#10B981' : '#F59E0B',
          backgroundColor: telegramId ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
        }]}>
          <View style={[styles.dot, { backgroundColor: telegramId ? '#10B981' : '#F59E0B' }]} />
          <Text style={[styles.miniBadgeText, { color: telegramId ? '#10B981' : '#F59E0B' }]}>
            {telegramId ? 'Telegram: Activo' : 'Telegram: Inactivo'}
          </Text>
        </View>
      </View>

      {/* ÁREA DE SCROLL INDEPENDIENTE */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* PANEL DE CONFIGURACIÓN DE TELEGRAM */}
        <View style={styles.cardInfo}>
          <View style={styles.cardInfoLayout}>
            <View style={styles.cardInfoTextColumn}>
              <Text style={styles.infoLabel}>Auditoría Remota (Opcional)</Text>
              <Text style={styles.infoDescription}>
                Vincular el bot permite resguardar copias certificadas de los reportes en tu Telegram automáticamente ante riesgos críticos. El análisis en pantalla funcionará aunque no te vincules.
              </Text>
            </View>
            <TouchableOpacity style={styles.btnMiniTelegram} onPress={handleLinkTelegram}>
              <Ionicons name="paper-plane" size={14} color="#FFF" />
              <Text style={styles.btnMiniTelegramText}>Abrir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={{ marginTop: 12, alignSelf: 'flex-start' }}
            onPress={() => setShowManualInput(!showManualInput)}
          >
            <Text style={styles.manualToggleText}>
              {showManualInput ? '▲ Ocultar entrada manual' : '▼ Si usas Expo Go, presiona aquí para guardar tu ID manual'}
            </Text>
          </TouchableOpacity>

          {showManualInput && (
            <TextInput
              style={styles.inputManual}
              placeholder="Pega el ID numérico que te dio el Bot"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={telegramId}
              onChangeText={handleSaveManualId}
            />
          )}
        </View>

        {/* CONTENEDOR DE CARGA MULTIMEDIA */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Carga de Archivo de Audio</Text>
          
          <TouchableOpacity style={styles.pickerZone} onPress={pickDocument}>
            <Ionicons 
              name={selectedFile ? "document-attach" : "cloud-upload-outline"} 
              size={40} 
              color={selectedFile ? "#10B981" : "#475569"} 
            />
            <Text style={styles.pickerText}>
              {selectedFile ? selectedFile.name : 'Toca aquí para seleccionar una nota de voz o audio'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpToggle} 
            onPress={() => setShowRouteHelp(!showRouteHelp)}
          >
            <Text style={styles.helpToggleText}>
              {showRouteHelp ? '▲ Ocultar guía' : '▼ ¿Cómo buscar audios de WhatsApp en mi celular?'}
            </Text>
          </TouchableOpacity>

          {showRouteHelp && (
            <View style={styles.helpBox}>
              <Text style={styles.helpText}>1. Al abrirse el explorador, despliega el menú lateral izquierdo.</Text>
              <Text style={styles.helpText}>2. Entra a "Almacenamiento Interno".</Text>
              <Text style={styles.helpText}>3. Sigue la ruta de carpetas multimedia:</Text>
              <Text style={styles.helpRouteText}>Android → media → com.whatsapp → WhatsApp → Media → WhatsApp Voice Notes</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.btnPrimary, (!selectedFile || loading) && styles.btnDisabled]}
            onPress={uploadWspAudio}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFF" />
                <Text style={styles.loadingText}>{loadingStatus}</Text>
              </View>
            ) : (
              <>
                <Ionicons name="analytics-sharp" size={18} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Iniciar Verificación Forense</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* INFORME DE RESPUESTA INTEGRADO CON PROTECCIÓN CONTRA PROPIEDADES NULAS */}
        {localResult && (
          <View style={[styles.resultCard, { borderColor: localResult?.metricas?.riesgo_global >= 35 ? '#EF4444' : '#10B981' }]}>
            <View style={[styles.resultHeader, { backgroundColor: localResult?.metricas?.riesgo_global >= 35 ? '#EF4444' : '#10B981' }]}>
              <Text style={styles.resultHeaderPayload}>
                {localResult?.metricas?.riesgo_global >= 35 ? 'DIAGNÓSTICO: ATENCIÓN DE RIESGO' : 'DIAGNÓSTICO: COMPORTAMIENTO SEGURO'}
              </Text>
            </View>
            
            <View style={styles.resultBody}>
              <Text style={styles.resumenTitle}>RESUMEN RÁPIDO:</Text>
              <Text style={styles.summaryText}>{localResult?.resumen_seguridad}</Text>
              
              <Text style={styles.resumenTitle}>TRANSCRIPCIÓN COMPLETA (WHISPER):</Text>
              <View style={styles.transcriptionBox}>
                <Text style={styles.transcriptionText}>"{localResult?.transcripcion_whisper}"</Text>
              </View>

              <Text style={styles.resumenTitle}>INDICADORES BIOMÉTRICOS DE AUDITORÍA:</Text>
              <View style={styles.miniMetricsBox}>
                <Text style={styles.metricItemText}>🔬 Probabilidad de Voz Artificial (Motor 1): {localResult?.metricas?.motor1_voz_ia} de 100</Text>
                <Text style={styles.metricItemText}>🗣️ Evaluación Física: {localResult?.metricas?.nivel_confianza_voz}</Text>
                <Text style={styles.metricItemText}>🧠 Alerta de Ingeniería Social (Motor 3): {localResult?.metricas?.motor3_ingenieria_social} de 100</Text>
                <Text style={styles.metricItemText}>⚠️ Nivel Unificado Global: {localResult?.metricas?.nivel} ({localResult?.metricas?.riesgo_global}/100)</Text>
              </View>

              {localResult?.recomendaciones_seguridad && localResult?.recomendaciones_seguridad?.length > 0 && (
                <>
                  <Text style={styles.resumenTitle}>MEDIDAS DEFENSIVAS EXIGIDAS:</Text>
                  <View style={styles.recommendationsBox}>
                    {localResult?.recomendaciones_seguridad?.map((rec, i) => (
                      <Text key={i} style={styles.recItemText}>• {rec}</Text>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* COLCHÓN DE RESPALDO DE ALTURA */}
        <View style={{ height: 130 }} />
      </ScrollView>

      {/* BARRA DE NAVEGACIÓN TOTALMENTE FIJA */}
      <BottomNavigation
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        handleLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Sora_700Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  miniBadgeText: {
    fontSize: 10,
    fontFamily: 'Sora_700Bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  cardInfo: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 15,
  },
  cardInfoLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfoTextColumn: {
    flex: 1,
    paddingRight: 10,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Sora_700Bold',
    color: '#F59E0B', 
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Sora_400Regular',
    lineHeight: 16,
  },
  manualToggleText: {
    fontSize: 11,
    color: '#3B82F6',
    fontFamily: 'Sora_700Bold',
    textDecorationLine: 'underline',
  },
  inputManual: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    fontSize: 13,
    color: '#FFF',
    fontFamily: 'Sora_400Regular',
  },
  btnMiniTelegram: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  btnMiniTelegramText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Sora_700Bold',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: 'Sora_700Bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  pickerZone: {
    borderWidth: 2,
    borderColor: '#475569',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  pickerText: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: 'Sora_400Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  helpToggle: {
    marginTop: 10,
    alignItems: 'center',
    padding: 4,
  },
  helpToggleText: {
    fontSize: 11,
    color: '#3B82F6',
    fontFamily: 'Sora_700Bold',
  },
  helpBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  helpText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Sora_400Regular',
    marginBottom: 4,
  },
  helpRouteText: {
    fontSize: 11,
    color: '#F59E0B',
    fontFamily: 'Sora_700Bold',
    marginTop: 4,
    lineHeight: 16,
  },
  btnPrimary: {
    backgroundColor: '#D62828',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Sora_700Bold',
    marginLeft: 6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginLeft: 10,
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
  },
  resultCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  resultHeader: {
    padding: 12,
    alignItems: 'center',
  },
  resultHeaderPayload: {
    color: '#FFF',
    fontFamily: 'Sora_700Bold',
    fontSize: 13,
  },
  resultBody: {
    padding: 18,
  },
  resumenTitle: {
    fontSize: 11,
    fontFamily: 'Sora_700Bold',
    color: '#94A3B8',
    marginBottom: 6,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 15,
    color: '#FFF',
    fontFamily: 'Sora_700Bold',
    lineHeight: 22,
    marginBottom: 10,
  },
  transcriptionBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  transcriptionText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontFamily: 'Sora_400Regular',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  miniMetricsBox: {
    backgroundColor: '#0F172A',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2B354F',
  },
  metricItemText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Sora_400Regular',
    marginBottom: 6,
  },
  recommendationsBox: {
    backgroundColor: 'rgba(214, 40, 40, 0.04)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(214, 40, 40, 0.15)',
  },
  recItemText: {
    color: '#FDA4AF',
    fontSize: 12,
    fontFamily: 'Sora_400Regular',
    marginBottom: 6,
    lineHeight: 18,
  }
});