import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ setCurrentScreen }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { registerUser } = useContext(AuthContext);

  const onRegisterPress = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }

    const result = await registerUser(nombre, email, password);
    if (result.success) {
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente. Ya puedes iniciar sesión.');
      setCurrentScreen('LOGIN'); 
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Icono superior que evoca paz y protección */}
      <Text style={styles.securityIcon}>🍃</Text>

      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Regístrate para mantener un historial seguro de tus análisis</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Nombre completo" 
        placeholderTextColor="#94A3B8" 
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        placeholderTextColor="#94A3B8"
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

      {/* Botón principal unificado en Azul Oscuro Profesional */}
      <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
        <Text style={styles.buttonText}>Registrarse Seguro</Text>
      </TouchableOpacity>

      {/* Enlace inferior en Azul de calma */}
      <TouchableOpacity onPress={() => setCurrentScreen('LOGIN')}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
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
    marginTop: 10,
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
  linkText: { 
    color: '#2563EB', 
    marginTop: 28, 
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14
  }
});