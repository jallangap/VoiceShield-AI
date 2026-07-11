import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
} from 'react-native';
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
  <ImageBackground
    source={require("../assets/login-bg.jpg")}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.overlay}>

      <Text style={styles.title}>
        Crear Cuenta
      </Text>

      <Text style={styles.subtitle}>
        Regístrate para comenzar a protegerte
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#555"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#555"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onRegisterPress}
      >
        <Text style={styles.buttonText}>
          Registrarse
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCurrentScreen("LOGIN")}
      >
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? Inicia sesión
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
    fontSize: 38,
    color: '#FFFFFF',
    fontFamily: 'Sora_700Bold',
    marginBottom: 10,
  },

  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 35,
    fontSize: 16,
    fontFamily: 'Sora_400Regular',
  },

  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Sora_400Regular',
  },

  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#C62828',
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

  linkText: {
    color: '#FFFFFF',
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Sora_400Regular',
  },
});