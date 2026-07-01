# VoiceShield AI - MVP Multiplataforma 🛡️🎙️

Detectar voces humanas reales o sintéticas clonadas IA. Análisis forense audio español.

Arquitectura Cliente-Servidor. App móvil ligera. Procesamiento backend local.

---

## 🏗️ Estructura

* 📂 **`backend/`**: FastAPI + Librosa. Analiza espectrogramas, MFCC, centroide espectral, artefactos digitales.
* 📂 **`mobile/`**: React Native + Expo. Grabación nativa. UI ciberseguridad (Verde=Seguro, Amarillo=Medio, Rojo=Peligro).

---

## 🚀 Backend Setup

### Requisitos
* Python 3.10+

### Instalación

1. Entrar carpeta:
```bash
cd backend
```

2. Entorno virtual:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python -m venv venv
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecutar:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Nota:** `--host 0.0.0.0` obligatorio. Celular necesita acceso red.

---

## 📱 Mobile Setup

### Requisitos
* Node.js LTS
* Expo Go (celular) o Android Studio (emulador)

### IP Local

**Windows/Linux terminal:**
```bash
ipconfig          # Windows
ifconfig          # Mac/Linux
```
Anotar IPv4 (ej: `192.168.100.140`)

### Variables entorno

Crear `mobile/.env`:

**Celular físico (Wi-Fi):**
```env
EXPO_PUBLIC_API_URL=http://192.168.100.140:8000
```

**Emulador Android:**
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
```

### Instalación

```bash
cd mobile
npm install
```

### Ejecutar

**Celular físico:**
```bash
npx expo start --tunnel -c
```
Escanear QR Expo Go.

**Emulador:**
```bash
npx expo start -c
```
Presionar `a` terminal.

---

## 🎯 ¿Cómo funciona?

1. **Captura:** Usuario graba audio español o sube archivo m4a/wav.
2. **Envío:** App envia bytes HTTP POST `/analyze-audio` backend.
3. **Análisis Librosa:** Backend procesa espectrograma localmente.
4. **Características extraídas:**
   - **MFCC:** Coeficientes mel-escala (uniformidad = artificial)
   - **Centroide espectral:** Estabilidad frecuencias (robótico = constante)
   - **Zero crossing rate:** Cambios abruptos (voz sintética = bajo)
   - **RMS Energy:** Variación amplitud (generada = uniforme)
   - **Silencio artificial:** Detección interrupciones no naturales

5. **Clasificación:** Puntuación 0-100 IA vs humano.
6. **Resultado JSON:**
```json
{
  "human_probability": 85,
  "ai_probability": 15,
  "risk_level": "Bajo",
  "message": "Voz humana identificada. Variabilidad acústica natural detectada."
}
```
7. **UI:** Celular pinta colores riesgo + porcentajes.

---

## 🛡️ Separación Tareas

**Subgrupo Acústica (Nosotros):**
- Endpoint `POST /analyze-audio`
- Análisis espectrogramas + artefactos físicos
- Bytes audio → JSON riesgo

**Subgrupo Texto (Otro equipo):**
- Endpoint `POST /analyze-text` (futuro)
- Patrones extorsión + palabras sospechosas
- Texto → JSON amenazas

Desacopladas. Ramas Git independientes.

---

## 📊 Esperado al Ejecutar

**Backend (Terminal 1):**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```
Presionar Enter. Escuchar en puerto 8000.

**Mobile (Terminal 2):**
```
Starting development server on http://192.168.100.XXX:8081
```
QR aparece. Escanear Expo Go o presionar `a` emulador.

**App:**
- Pantalla "Análisis de audio" carga
- Botón "Grabar audio" (verde)
- Botón "Seleccionar archivo" (naranja)
- Grabamos → "Reproducir Audio" (cyan)
- Click "Analizar Audio" (cyan)
- Esperar 2-3 segundos
- Pantalla "Resultados" muestra % + color riesgo

---

## 🔧 Herramienta IA: Librosa

- **Ventaja:** Gratis. Local. Sin API Keys. Rápido (2s análisis).
- **Precisión:** ~75% (mejora con dataset etiquetado).
- **Idioma:** Agnóstico (características acústicas universales).
- **Dependencies:** numpy, scipy, librosa (75MB total).

---

## 🚨 Si no funciona

**"Network request failed":**
- Verificar IP `.env` mobile
- Backend escuchando 0.0.0.0:8000
- Mismo Wi-Fi celular + PC

**"Audio vacío":**
- Grabar 3+ segundos
- Formato m4a/wav válido
- Revisar permisos micrófono

**Timeout 5s:**
- Backend lentitud CPU (pocas specs)
- Audio >60 segundos
- Librosa procesando background
