# Guardian AI — App (fase 1: solo front, sin backend, sin Clerk)

Este proyecto trae las 3 pantallas conectadas entre sí con navegación local
(sin librerías de navegación), y un usuario "de mentira" (`mockUser` en
`mockData.js`) en vez de login real.

## Cómo correrlo

1. Instala Expo CLI si no lo tienes (no hace falta instalarlo global, `npx`
   ya lo resuelve).
2. Dentro de la carpeta del proyecto:

   ```bash
   npm install
   npx expo start
   ```

3. Escanea el código QR con la app **Expo Go** en tu celular (Android/iOS),
   o presiona `w` en la terminal para abrirlo en el navegador.

## Flujo actual

- **WelcomeScreen** → cualquiera de los 3 botones (Iniciar sesión, Crear
  cuenta, Continuar como invitado) te "loguea" con el usuario simulado y
  te lleva a Nuevo Análisis.
- **NewAnalysisScreen** → el audio y sus datos son fijos (mock), tú puedes
  escribir el nombre del remitente. "Analizar audio" te lleva al reporte.
- **ReportScreen** → muestra el resultado simulado (82% riesgo, técnicas,
  frases, recomendación). "Analizar otro audio" regresa a la pantalla
  anterior.

## Qué falta (próximos pasos, cuando lo indiques)

- **Clerk** (`@clerk/clerk-expo`): reemplazar `handleLogin` en `App.js` por
  el flujo real de Clerk (sign in / sign up / sign out), y `mockUser` por
  el usuario real de `useUser()`.
- **Backend**: subir el audio real (grabado o importado), mandarlo a un
  endpoint que lo analice, y reemplazar `mockAnalysisResult` por la
  respuesta real.
- **Grabación/importación real de audio**: con `expo-av` o
  `expo-document-picker`.

## Estructura

```
guardian-ai-app/
  App.js                 <- navegación local + estado global mínimo
  mockData.js             <- usuario y datos simulados (a reemplazar luego)
  theme.js                <- colores y espaciados compartidos
  screens/
    WelcomeScreen.js
    NewAnalysisScreen.js
    ReportScreen.js
```
