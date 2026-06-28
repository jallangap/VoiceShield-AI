# VoiceShield AI

MVP multiplataforma con:

- `mobile/`: app React Native + Expo Go
- `backend/`: API FastAPI para análisis experimental de audio

## Flujo

1. La app permite grabar audio con el micrófono o elegir un archivo local.
2. El audio se envía al backend con `POST /analyze-audio`.
3. El backend devuelve una clasificación experimental con probabilidades, nivel de riesgo y recomendaciones.

## 1. Configuración del Backend

El backend debe ser accesible no solo para tu computadora, sino para toda tu red local (Wi-Fi), para que el celular pueda conectarse a él.

```bash
cd backend

# 1. Crea y activa tu entorno virtual
python -m venv venv
.\venv\Scripts\activate   # (En Windows)
# source venv/bin/activate # (En Mac/Linux)

# 2. Instala las dependencias
pip install -r requirements.txt

# 3. Inicia el servidor expuesto a tu red local (0.0.0.0)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
> **Nota Importante:** Usar `--host 0.0.0.0` es crucial. Si solo usas `uvicorn main:app`, el servidor se ejecuta en `127.0.0.1` (localhost) y tu celular no podrá comunicarse con él.

## 2. Configuración de la App Móvil (Expo)

Para que tu celular sepa a dónde enviar los audios, debes configurar la IP local de tu computadora (por ejemplo, `192.168.100.2`).

1. Abre una terminal y busca tu IP (comando `ipconfig` en Windows o `ifconfig` en Mac/Linux).
2. Dentro de la carpeta `mobile`, crea un archivo llamado `.env` y añade tu IP:
   ```env
   EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:8000
   ```
   *(Ejemplo: `EXPO_PUBLIC_API_URL=http://192.168.100.2:8000`)*

Luego, inicia la aplicación:

```bash
cd mobile

# 1. Instala las dependencias
npm install

# 2. Inicia Expo
npx expo start
```

## Notas adicionales:

- **Dispositivo físico (Expo Go):** Asegúrate de que tanto tu celular como tu computadora estén conectados a la **misma red Wi-Fi**.
- **Emulador Android:** Si pruebas desde un emulador de Android en tu PC y no usas el archivo `.env`, puedes apuntar a `http://10.0.2.2:8000`, que es el alias para el localhost de la computadora.
- La detección de Inteligencia Artificial usa un modelo experimental y está pensada para fines demostrativos en el MVP.
