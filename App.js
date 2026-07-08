import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import { AuthProvider, AuthContext } from './context/AuthContext';

import { checkBackendHealth, uploadForensicAudio } from './services/api';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';

function NavigationApp() {
  const { token, loading, user, logoutUser } = useContext(AuthContext);

  const [currentScreen, setCurrentScreen] = useState('SPLASH');
  const [isGuest, setIsGuest] = useState(false);
  const [audioAnalizedCount, setAudioAnalizedCount] = useState(0);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const [loadingStatus, setLoadingStatus] = useState(""); 
  const [serverOnline, setServerOnline] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (currentScreen === 'SPLASH') {
      const timer = setTimeout(() => {
        if (!loading && token) {
          setIsGuest(false);
          setCurrentScreen('MAIN');
        } else {
          setCurrentScreen('LOGIN');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, loading, token]);

  useEffect(() => {
    if (token && currentScreen === 'LOGIN') {
      setIsGuest(false);
      setAudioAnalizedCount(0);
      setAnalysisResult(null);
      setSelectedFile(null);
      setCurrentScreen('MAIN');
    }
  }, [token]);

  const comprobarConexionBackend = async () => {
    const online = await checkBackendHealth();
    setServerOnline(online);
  };

  useEffect(() => {
    comprobarConexionBackend();
  }, []);

  const handleLogin = () => {
    setIsGuest(false);
    setAudioAnalizedCount(0);
    setAnalysisResult(null);
    setSelectedFile(null);
    setCurrentScreen('MAIN');
  };

  const handleGuestAccess = () => {
    setIsGuest(true);
    setAudioAnalizedCount(0);
    setAnalysisResult(null);
    setSelectedFile(null);
    setCurrentScreen('MAIN');
  };

  const handleLogout = () => {
    logoutUser();
    setIsGuest(false);
    setSelectedFile(null);
    setAnalysisResult(null);
    setCurrentScreen('LOGIN');
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
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo de audio.');
    }
  };

  const uploadAudio = async () => {
    if (!selectedFile) {
      Alert.alert('Atención', 'Por favor selecciona un archivo primero.');
      return;
    }

    if (isGuest && audioAnalizedCount >= 1) {
      Alert.alert(
        "Límite alcanzado",
        "Has alcanzado el límite de uso para usuarios invitados. Regístrate o inicia sesión para continuar."
      );
      return;
    }

    // Cambios secuenciales simulados antes de disparar la petición HTTP
    setLoadingStatus("🎙️ Motor 1: Evaluando biometría acústica artificial...");
    
    const statusIntervals = [
      setTimeout(() => setLoadingStatus("🧠 Motor 2: Transcribiendo flujo de audio con Whisper Neural..."), 3800),
      setTimeout(() => setLoadingStatus("📡 Motor 3: Buscando patrones conversacionales de Ingeniería Social..."), 3800),
      setTimeout(() => setLoadingStatus("📊 Motor 4: Generando matrices de riesgo global..."), 3800)
    ];

    try {
      const userIdToSend = (!isGuest && user?.id) ? user.id : null;
      const data = await uploadForensicAudio(selectedFile, userIdToSend);

      setAnalysisResult(data);
      setAudioAnalizedCount(prev => prev + 1);

    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error de Conexión',
        error.message || 'No se pudo establecer comunicación con el motor forense.'
      );
    } finally {
      statusIntervals.forEach(clearTimeout);
      setLoadingStatus("");
    }
  };

  if (currentScreen === 'SPLASH') {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🛡️</Text>
        </View>
        <Text style={styles.splashTitle}>GuardIAn</Text>
        <Text style={styles.splashSubtitle}>Detección de Ingeniería Social</Text>
        <ActivityIndicator size="small" color="#3B82F6" style={{ marginTop: 30 }} />
      </View>
    );
  }

  if (currentScreen === 'LOGIN') {
    return (
      <LoginScreen 
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        handleLogin={handleLogin} handleGuestAccess={handleGuestAccess}
        setCurrentScreen={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'REGISTER') {
    return (
      <RegisterScreen 
        setCurrentScreen={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'MAIN') {
    return (
      <MainScreen 
        pickDocument={pickDocument}
        uploadAudio={uploadAudio}
        selectedFile={selectedFile}
        analysisResult={analysisResult}
        loading={!!loadingStatus}
        loadingStatus={loadingStatus}
        handleLogout={handleLogout}
        userData={!isGuest ? user : null} 
        setCurrentScreen={setCurrentScreen} 
        serverOnline={serverOnline}
      />
    );
  }

  if (currentScreen === 'DETAILS') {
    return (
      <DetailsScreen 
        analysisResult={analysisResult} 
        setCurrentScreen={setCurrentScreen} 
      />
    );
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { 
    flex: 1, 
    backgroundColor: '#F4F7FC', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logoBadge: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    marginBottom: 20,
    elevation: 2,
  },
  logoIcon: { 
    fontSize: 48 
  },
  splashTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#0F172A',
    letterSpacing: 1
  },
  splashSubtitle: { 
    fontSize: 15, 
    color: '#64748B', 
    marginTop: 8 
  }
});