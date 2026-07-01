from __future__ import annotations

import logging
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from librosa_analyzer import AnalysisResult, LibrosaVoiceAnalyzer

# Configuramos el logger para registrar las solicitudes en la consola
logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="VoiceShield AI API (Librosa)", version="3.0.0")

# Mantenemos soporte amplio para desarrollo flexible entre oficina, casa y móvil físico.
ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://10.0.2.2:8081",  # Emulador Android
    "*",                     # Permitir móviles físicos en subredes Wi-Fi dinámicas de desarrollo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = LibrosaVoiceAnalyzer()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)) -> dict[str, object]:
    # Registramos en consola el archivo que está ingresando
    logger.info(f"Recibiendo solicitud de análisis: Archivo='{file.filename}', Tipo MIME='{file.content_type}'")
    
    audio_bytes = await file.read()

    if not audio_bytes:
        logger.warning("Solicitud rechazada: El archivo de audio llegó vacío.")
        raise HTTPException(status_code=400, detail="No se recibió contenido de audio.")

    try:
        # Enviamos los bytes y el content_type (esencial para que pydub detecte si es m4a)
        result: AnalysisResult = analyzer.analyze(audio_bytes, file.content_type)
    except ValueError as exc:
        logger.error(f"Error de validación en el analizador: {str(exc)}")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.error(f"Error inesperado en endpoint: {str(exc)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error interno del servidor en el endpoint de análisis.")

    # Registramos el veredicto final en la terminal antes de responder al móvil
    logger.info(f"Análisis completado con éxito -> Riesgo: {result.risk_level} | IA: {result.ai_probability}% | Humano: {result.human_probability}%")

    return {
        "human_probability": result.human_probability,
        "ai_probability": result.ai_probability,
        "risk_level": result.risk_level,
        "message": result.message,
    }


if __name__ == "__main__":
    import uvicorn

    # Forzamos a escuchar en 0.0.0.0 para que acepte conexiones del Wi-Fi de la casa/oficina
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)