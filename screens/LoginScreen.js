import React, { useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
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

  const onLoginPress = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }

    const result = await loginUser(email, password);
    if (result.success) {
      Alert.alert('¡Éxito!', 'Inicio de sesión correcto.');
      handleLogin(); 
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Icono de seguridad integrado sutilmente para evocar cuidado */}
      <Text style={styles.securityIcon}>🛡️</Text>
      
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.subtitle}>Tu espacio seguro de protección y cuidado personal</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        placeholderTextColor="#94A3B8" // Gris pizarra suave y legible
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        placeholderTextColor="#94A3B8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón principal en Azul Oscuro Profesional */}
      <TouchableOpacity style={styles.button} onPress={onLoginPress}>
        <Text style={styles.buttonText}>Ingresar Seguro</Text>
      </TouchableOpacity>

      {/* Botón secundario de invitado con un borde Azul Tranquilo */}
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
    backgroundColor: '#F4F7FC' 
  },
  securityIcon: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 8,
    color: '#1E293B'
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 6, 
    textAlign: 'center', 
    color: '#0F172A' 
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 16, 
    color: '#1E293B', 
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: { 
    backgroundColor: '#1E293B', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  guestButton: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5, 
    borderColor: '#3B82F6', 
    marginTop: 14,
    shadowOpacity: 0.05,
  },
  guestButtonText: { 
    color: '#3B82F6', 
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkText: { 
    color: '#2563EB', 
    marginTop: 28, 
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14
  }
});