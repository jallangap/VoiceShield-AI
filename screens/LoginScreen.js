import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

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
    <View style={styles.container}>
      <Image 
        source={require('../assets/GuardIAn.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.subtitle}>Analiza quién habla y cómo intenta influenciarte</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        placeholderTextColor="#64748B" 
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
        placeholderTextColor="#64748B"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage('');
        }}
        secureTextEntry
      />

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={onLoginPress}>
        <Text style={styles.buttonText}>Ingresar Seguro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.guestButton]} onPress={handleGuestAccess}>
        <Text style={styles.guestButtonText}>Ingresar como Invitado</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentScreen('REGISTER')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate de forma segura aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: '#1E293B' 
  },
  logo: {
    width: '100%',
    height: 180, 
    alignSelf: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E1', 
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 22,
  },
  input: { 
    borderWidth: 1.5, 
    borderColor: '#475569', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 16, 
    color: '#FFFFFF', 
    backgroundColor: '#0F172A', 
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#451A23', 
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EF4444', 
  },
  errorText: {
    color: '#FCA5A5', 
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: { 
    backgroundColor: '#0A42BA', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 4, 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  guestButton: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: '#D297FD', 
    marginTop: 16,
  },
  guestButtonText: { 
    color: '#D297FD', 
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkText: { 
    color: '#38BDF8', 
    marginTop: 32, 
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15
  }
});