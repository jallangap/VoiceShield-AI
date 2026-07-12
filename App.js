import React, { useState, useEffect, useContext } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { checkBackendHealth, uploadForensicAudio } from './services/api';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';
import WspAnalysisScreen from './screens/WspAnalysisScreen';
import { useFonts } from 'expo-font';
import {
  Sora_400Regular,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';

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
      }, 2500); 
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

    const mensajesModelos = [
      "🎙️ Motor 1: Evaluando biometría acústica artificial...",
      "🧠 Motor 2: Transcribiendo flujo de audio con Whisper Neural...",
      "📡 Motor 3: Buscando patrones conversacionales de Ingeniería Social...",
      "📊 Motor 4: Generando matrices de riesgo global..."
    ];

    let index = 0;
    setLoadingStatus(mensajesModelos[index]);

    const intervalId = setInterval(() => {
      index = (index + 1) % mensajesModelos.length;
      setLoadingStatus(mensajesModelos[index]);
    }, 3500);

    try {
      const userIdToSend = (!isGuest && user?.id) ? user.id : null;
      const data = await uploadForensicAudio(selectedFile, userIdToSend, "microfono");

      setAnalysisResult(data);
      setAudioAnalizedCount(prev => prev + 1);

    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error de Conexión',
        error.message || 'No se pudo establecer comunicación con el motor forense.'
      );
    } finally {
      clearInterval(intervalId);
      setLoadingStatus("");
    }
  };

  if (currentScreen === 'SPLASH') {
  return (
    <ImageBackground
      source={require('./assets/login-bg2.jpg')}
      style={styles.splashContainer}
      resizeMode="cover"
    >
      <View style={styles.splashOverlay}>

        <Text style={styles.splashTitle}>
          Guard
          <Text style={styles.splashTitleIA}>IA</Text>
          n
        </Text>

        <Text style={styles.splashSubtitle}>
          Detección de Ingeniería Social
        </Text>

        <ActivityIndicator
          size="small"
          color="#FFFFFF"
          style={{ marginTop: 35 }}
        />

      </View>
    </ImageBackground>
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

if (currentScreen === 'WSP_ANALYSIS') {
  return (
    <WspAnalysisScreen
      setCurrentScreen={setCurrentScreen}
      currentScreen={currentScreen}
      handleLogout={handleLogout}
      userId={!isGuest ? user?.id : null}
      isGuest={isGuest}
      audioAnalizedCount={audioAnalizedCount}
      setAudioAnalizedCount={setAudioAnalizedCount}
      setAnalysisResultGlobal={setAnalysisResult}
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
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
  flex: 1,
},

splashOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 25,
},

splashTitle: {
  fontSize: 52,
  color: '#FFFFFF',
  fontFamily: 'Sora_700Bold',
},

splashTitleIA: {
  color: '#C62828',
  fontFamily: 'Sora_700Bold',
},

splashSubtitle: {
  marginTop: 12,
  fontSize: 17,
  color: '#FFFFFF',
  fontFamily: 'Sora_400Regular',
  textAlign: 'center',
}
});