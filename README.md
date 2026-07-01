# VoiceShield AI - MVP Multiplataforma 🛡️🎙️

VoiceShield AI es una aplicación móvil de ciberseguridad diseñada para detectar si una voz es humana real o si se trata de un clon sintético generado por Inteligencia Artificial (Deepfake Acoustic) mediante análisis forense de audio en español.

El proyecto está diseñado bajo una **Arquitectura Cliente-Servidor**. La aplicación móvil se mantiene ligera delegando el procesamiento pesado a una API externa de baja latencia basada en FastAPI y Google Gemini.

---

## 🏗️ Estructura del Repositorio

El proyecto está dividido de forma modular en dos carpetas principales:

* 📂 **`backend/`**: API REST construida con FastAPI. Consume de forma nativa la SDK de Google Gemini para analizar las características físicas del sonido (frecuencias, artefactos digitales y fluidez acústica) sin saturar el hardware local.
* 📂 **`mobile/`**: Aplicación móvil en React Native optimizada con Expo Go (SDK). Gestiona la captura nativa de audio del micrófono, la selección de archivos locales y la interfaz semántica de riesgo (Verde = Seguro, Amarillo = Advertencia, Rojo = Peligro).

---

## 🚀 Cómo hacer funcionar el Backend (FastAPI)

El servidor debe estar encendido y expuesto a tu red para que el dispositivo móvil pueda comunicarse con él.

### Requisitos previos
* Python 3.10 o superior instalado.
* Una API Key de desarrollador obtenida en [Google AI Studio](https://aistudio.google.com/).

### Pasos para la instalación y ejecución:

1.  **Entrar a la carpeta correspondiente:**
    ```bash
    cd backend
    ```

2.  **Crear y activar el entorno virtual:**
    * **En Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    * **En Mac/Linux:**
        ```bash
        python -m venv venv
        source venv/bin/activate
        ```

3.  **Configurar tus credenciales de IA:**
    * Copia el archivo `.env.example` y renombralo como `.env`.
    * Abre tu nuevo `.env` y coloca tu API Key real en la variable:
        ```env
        GOOGLE_API_KEY=AIzaSy... (o tu clave generada)
        ```

4.  **Instalar dependencias optimizadas:**
    *(Nota: Se eliminaron por completo Torch, Transformers y Librosa. El servidor ahora es ultra ligero e inicia de inmediato).*
    ```bash
    pip install -r requirements.txt
    ```

5.  **Arrancar el servidor expuesto a la red local:**
    ```bash
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    > ⚠️ **Nota Crucial:** Usar `--host 0.0.0.0` es obligatorio. Si usas el localhost por defecto (`127.0.0.1`), tu celular físico no podrá conectarse con la API de la computadora.

---

## 📱 Cómo hacer funcionar la App Móvil (Expo)

### Requisitos previos
* Node.js (Versión LTS recomendada).
* La aplicación **Expo Go** instalada en tu celular físico o un emulador de Android configurado en tu PC (vía Android Studio).

### Pasos para la configuración del entorno (.env):

Antes de encender Expo, debes configurar la IP del servidor móvil para evitar el error `Network request failed`.

1.  **Averigua tu IP local (IPv4):**
    * En Windows terminal: `ipconfig`
    * En Mac/Linux terminal: `ifconfig`
    * Busca tu adaptador Wi-Fi y anota tu dirección (ejemplo: `192.168.100.140`).

2.  **Crear las variables de entorno móviles:**
    * Ve a la carpeta `mobile/` y crea un archivo llamado `.env`.
    * **Si pruebas con tu CELULAR FÍSICO (Wi-Fi):** Coloca la dirección IP real de tu PC:
        ```env
        EXPO_PUBLIC_API_URL=[http://192.168.100.140:8000](http://192.168.100.140:8000)
        ```
    * **Si pruebas estrictamente con EMULADOR en la PC:** Coloca el alias nativo del localhost de Android:
        ```env
        EXPO_PUBLIC_API_URL=[http://10.0.2.2:8000](http://10.0.2.2:8000)
        ```

### Pasos para la instalación y ejecución:

1.  **Entrar a la carpeta de la app e instalar los módulos:**
    ```bash
    cd mobile
    npm install
    ```

2.  **Iniciar el servidor de desarrollo (Limpiando el caché de entorno):**
    * **Para Celular Físico (Recomendado si hay problemas de Firewall):**
        ```bash
        npx expo start --tunnel -c
        ```
        *(Abre la app de Expo Go en tu teléfono y escanea el código QR generado).*
    * **Para Emulador de Android:**
        ```bash
        npx expo start -c
        ```
        *(Una vez cargado, presiona la tecla `a` en tu teclado para que compile directo en el simulador activo).*

---

## 🛡️ Límites del Alcance y Trabajo en Equipo

Para evitar colisiones de código y mantener una separación limpia de tareas dentro de nuestro grupo de trabajo, los alcances están estrictamente divididos:

1.  **Nuestro Subgrupo (Análisis Acústico):** Gestiona únicamente el endpoint `POST /analyze-audio`. Este analiza puros bytes de sonido, espectrogramas y artefactos físicos de clonación usando la API de Gemini.
2.  **Subgrupo de Texto (Detección de Extorsión):** Ellos implementarán de forma aislada su lógica de scraping de palabras sospechosas y patrones semánticos de fraude en un endpoint independiente llamado `POST /analyze-text` dentro de este mismo backend.

Las lógicas están totalmente desacopladas para que cada equipo pueda avanzar en sus ramas de Git de forma autónoma.