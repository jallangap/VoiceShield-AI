import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';

export default function LoginScreen({
  email,
  setEmail, 
  password, 
  setPassword, 
  handleLogin, 
  handleGuestAccess, 
  setCurrentScreen 
}) {
  const { loginUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const onLoginPress = async () => {
    if (!email || !password) {
      const emptyFieldsMessage = 'Por favor llena todos los campos.';
      setErrorMessage(emptyFieldsMessage);
      Alert.alert('Error', emptyFieldsMessage);
      return;
    }

    setErrorMessage('');

    const result = await loginUser(email, password);
    if (result && result.success) {
      Alert.alert('¡Éxito!', 'Inicio de sesión correcto.');
      handleLogin(); 
    } else {
      const fallbackError = result && result.error ? result.error : 'No se pudo iniciar sesión. Verifica tus credenciales.';
      
      setErrorMessage(fallbackError);
      Alert.alert('Error', fallbackError);
    }
  };

return (
  <ImageBackground
    source={require("../assets/login-bg.jpg")}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.overlay}>

      <Image
      
        style={styles.logo}
        resizeMode="stretch"
      />

      <Text style={styles.title}>
  Guard
  <Text style={styles.titleIA}>IA</Text>
  n
</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#555"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errorMessage) setErrorMessage('');
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#555"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage('');
        }}
        secureTextEntry
      />

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            ⚠️ {errorMessage}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={onLoginPress}
      >
        <Text style={styles.buttonText}>
          Ingresar 
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={handleGuestAccess}
      >
        <Text style={styles.guestButtonText}>
          Continuar como invitado
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCurrentScreen('REGISTER')}
      >
        <Text style={styles.linkText}>
          ¿No tienes cuenta? Crear cuenta
        </Text>
      </TouchableOpacity>

    </View>
  </ImageBackground>
);
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 50,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Sora_700Bold',
    marginBottom: 300,
     marginTop: -50
  },
  titleIA: {
  color: '#D32F2F', // Rojo
  fontFamily: 'Sora_700Bold',
},

  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    fontFamily: 'Sora_400Regular',
  },

  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#000000',          // ← texto que escribes
    fontFamily: 'Sora_400Regular',
  },

  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#C62828', // rojo
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Sora_700Bold',
  },

  guestButton: {
    width: '100%',
    height: 55,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Sora_700Bold',
  },

  linkText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 25,
    fontFamily: 'Sora_400Regular',
  },

  errorContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },

  errorText: {
    color: '#C62828',
    textAlign: 'center',
    fontFamily: 'Sora_400Regular',
  },
});