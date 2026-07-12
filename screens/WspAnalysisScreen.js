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

  // ESCUCHA DE ENLACES PROFUNDOS
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
          Alert.alert('¡Éxito!', 'Canal de auditoría pericial vinculado.');
        }
      }
    } catch (error) {
      console.error('Error al procesar deep link:', error);
    }
  };

  // Cargar ID almacenado de respaldo
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

  const handleLinkTelegram = () => {
    Linking.openURL('https://t.me/GuardIAnCriticBot');
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
          mimeType: file.mimeType || 'audio/wav',
        });
        setLocalResult(null); 
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo.');
    }
  };

  const uploadWspAudio = async () => {
    if (!selectedFile) {
      Alert.alert('Atención', 'Por favor selecciona un archivo de audio primero.');
      return;
    }

    if (isGuest && audioAnalizedCount >= 1) {
      Alert.alert("Límite alcanzado", "Has alcanzado el límite de uso para usuarios invitados.");
      return;
    }

    const mensajesModelos = [
      "Extrayendo archivo multimedia...",
      "Analizando acústica forense...",
      "Buscando patrones de manipulación...",
      "Generando veredicto pericial..."
    ];

    let index = 0;
    setLoading(true);
    setLoadingStatus(mensajesModelos[index]);

    const intervalId = setInterval(() => {
      index = (index + 1) % mensajesModelos.length;
      setLoadingStatus(mensajesModelos[index]);
    }, 3000);

    try {
      const telegramIdToSend = telegramId ? telegramId : null;
      const data = await uploadForensicAudio(selectedFile, userId, 'whatsapp', telegramIdToSend);
      
      setLocalResult(data);
      if (setAnalysisResultGlobal) setAnalysisResultGlobal(data);
      setAudioAnalizedCount(prev => prev + 1);

      if (telegramIdToSend) {
        Alert.alert("Análisis Completo", "Evidencias respaldadas en tu bot de Telegram.");
      } else {
        Alert.alert("Análisis Completo", "Resultados listos abajo en pantalla.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Red', 'Asegúrate de que tu URL de Ngrok esté activa y guardada en api.js.');
    } finally {
      clearInterval(intervalId);
      setLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER CORREGIDO: SE AJUSTA AUTOMÁTICAMENTE A PANTALLAS REDMI */}
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
            {telegramId ? 'Vinculado' : 'Sin Vincular'}
          </Text>
        </View>
      </View>

      {/* CONTENEDOR DE SCROLL ELÁSTICO MAESTRO */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* SECCIÓN DE INFORMACIÓN DE AUDITORÍA */}
        <View style={styles.cardInfo}>
          <View style={styles.cardInfoLayout}>
            <View style={styles.cardInfoTextColumn}>
              <Text style={styles.infoLabel}>Auditoría Externa (Opcional)</Text>
              <Text style={styles.infoDescription}>
                Vincular el bot permite resguardar copias certificadas de las evidencias de audio de forma segura. El análisis en pantalla funcionará aunque no te vincules.
              </Text>
            </View>
            <TouchableOpacity style={styles.btnMiniTelegram} onPress={handleLinkTelegram}>
              <Ionicons name="paper-plane" size={14} color="#FFF" />
              <Text style={styles.btnMiniTelegramText}>Abrir</Text>
            </TouchableOpacity>
          </View>

          {/* Fallback de entrada manual por bloqueo de Expo Go */}
          <TouchableOpacity 
            style={{ marginTop: 10, alignSelf: 'flex-start' }}
            onPress={() => setShowManualInput(!showManualInput)}
          >
            <Text style={styles.manualToggleText}>
              {showManualInput ? '▲ Ocultar entrada manual' : '▼ Si falla la vinculación automática, presiona aquí'}
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

        {/* CONTENEDOR DE CONTROL MULTIMEDIA */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Carga Forense Multimedia</Text>
          
          <TouchableOpacity style={styles.pickerZone} onPress={pickDocument}>
            <Ionicons 
              name={selectedFile ? "document-attach" : "cloud-upload-outline"} 
              size={40} 
              color={selectedFile ? "#10B981" : "#475569"} 
            />
            <Text style={styles.pickerText}>
              {selectedFile ? selectedFile.name : 'Selecciona una nota de voz o archivo de sonido'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpToggle} 
            onPress={() => setShowRouteHelp(!showRouteHelp)}
          >
            <Text style={styles.helpToggleText}>
              {showRouteHelp ? '▲ Ocultar guía' : '▼ ¿Cómo buscar audios de WhatsApp en mi Redmi?'}
            </Text>
          </TouchableOpacity>

          {showRouteHelp && (
            <View style={styles.helpBox}>
              <Text style={styles.helpText}>1. Al abrirse el explorador, abre el menú lateral izquierdo.</Text>
              <Text style={styles.helpText}>2. Entra a "Almacenamiento Interno".</Text>
              <Text style={styles.helpText}>3. Sigue la ruta estándar de la comunidad:</Text>
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

        {/* TARJETA DE RESPUESTAS CORREGIDA (EVITA EL COLAPSOFLEX) */}
        {localResult && (
          <View style={[styles.resultCard, { borderColor: localResult.metricas.riesgo_global >= 35 ? '#EF4444' : '#10B981' }]}>
            <View style={[styles.resultHeader, { backgroundColor: localResult.metricas.riesgo_global >= 35 ? '#EF4444' : '#10B981' }]}>
              <Text style={styles.resultHeaderPayload}>
                {localResult.metricas.riesgo_global >= 35 ? 'DIAGNÓSTICO: ATENCIÓN DE RIESGO' : 'DIAGNÓSTICO: COMPORTAMIENTO SEGURO'}
              </Text>
            </View>
            <View style={styles.resultBody}>
              <Text style={styles.summaryText}>{localResult.resumen_seguridad}</Text>
              
              <View style={styles.miniMetricsBox}>
                <Text style={styles.metricItemText}>🔬 Probabilidad de Clonación: {localResult.metricas.motor1_voz_ia} de 100</Text>
                <Text style={styles.metricItemText}>🗣️ Evaluación Acústica: {localResult.metricas.nivel_confianza_voz}</Text>
                <Text style={styles.metricItemText}>🧠 Alerta de Ingeniería Social: {localResult.metricas.motor3_ingenieria_social} de 100</Text>
                <Text style={styles.metricItemText}>⚠️ Nivel Unificado Global: {localResult.metricas.nivel}</Text>
              </View>

              <TouchableOpacity style={styles.btnDetails} onPress={() => setCurrentScreen('DETAILS')}>
                <Text style={styles.btnDetailsText}>Auditar informe forense detallado →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* COLCHÓN DE RESPALDO DE ALTURA PARA EVITAR QUE LA BARRA TAPE EL TEXTO */}
        <View style={{ height: 130 }} />
      </ScrollView>

      {/* COMPONENTE TOTALMENTE FIJO EN LA BASE */}
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
    padding: 10,
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
    marginBottom: 10,
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
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Sora_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  miniMetricsBox: {
    backgroundColor: '#0F172A',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2B354F',
  },
  metricItemText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Sora_400Regular',
    marginBottom: 6,
  },
  btnDetails: {
    padding: 5,
  },
  btnDetailsText: {
    color: '#3B82F6',
    fontFamily: 'Sora_700Bold',
    fontSize: 13,
  }
});