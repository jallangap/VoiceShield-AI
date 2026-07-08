
Readme · MD
# GuardIAn 🛡️
 
**Herramienta móvil de seguridad forense para la detección de estafas y fraudes mediante análisis de audio.**
 
GuardIAn combina inteligencia artificial, procesamiento de lenguaje natural y análisis acústico para determinar si una llamada o nota de voz es un intento de fraude, suplantación o manipulación psicológica.
 
---
 
## ✨ Características principales
 
### 🎭 Detección de voces falsas (Deepfake Audio)
Analiza el archivo de audio mediante modelos de IA para identificar si la voz es humana real o si fue generada/clonada artificialmente.
 
### 🧠 Identificación de engaños psicológicos
Transcribe el audio utilizando **Whisper** y analiza el contenido textual para detectar:
- Tácticas de ingeniería social
- Amenazas o coacción
- Patrones de manipulación emocional
### 📊 Análisis estructural del audio
Evalúa características físicas de la conversación, tales como:
- Ritmo del habla
- Cantidad y duración de silencios
- Duración total del audio
### ⚠️ Veredicto de riesgo
Genera un **porcentaje global de peligro** junto con un diagnóstico claro:
- 🟢 Riesgo bajo
- 🟡 Riesgo medio
- 🔴 Riesgo crítico
Incluye además un **protocolo de recomendaciones** personalizado para ayudar al usuario a evitar caer en la estafa.
 
### 👤 Modos de uso
- **Usuario registrado:** guarda un historial seguro de todos los análisis realizados.
- **Modo invitado:** permite realizar un análisis rápido sin necesidad de crear una cuenta.
---
 
## 🧩 Flujo de análisis
 
1. El usuario sube o graba un archivo de audio.
2. GuardIAn transcribe el audio con Whisper.
3. Se ejecutan en paralelo:
   - Detección de deepfake de voz
   - Análisis semántico del texto transcrito
   - Análisis estructural/acústico del audio
4. Los resultados se combinan en un veredicto de riesgo global.
5. Se muestra el diagnóstico junto con recomendaciones de seguridad.
---
 
## 🎯 Objetivo
 
Proteger a los usuarios —especialmente a los más vulnerables frente a fraudes telefónicos— brindando una herramienta accesible que combine forense de audio e inteligencia artificial para detectar estafas antes de que ocurran.