import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#08111F',
    card: '#101A2E',
    text: '#F8FAFC',
    border: '#1E2A44',
    primary: '#67E8F9',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#08111F' }}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#08111F' },
              headerShadowVisible: false,
              headerTintColor: '#F8FAFC',
              contentStyle: { backgroundColor: '#08111F' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Analisis"
              component={AnalysisScreen}
              options={{ title: 'Análisis de audio' }}
            />
            <Stack.Screen
              name="Resultados"
              component={ResultsScreen}
              options={{ title: 'Resultados' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
