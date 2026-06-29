from __future__ import annotations

import json
import os
from dataclasses import dataclass
import google.generativeai as genai

@dataclass(frozen=True)
class AnalysisResult:
    human_probability: int
    ai_probability: int
    risk_level: str
    message: str

class GeminiVoiceAnalyzer:
    def __init__(self):
        # Busca la API Key configurada en el archivo .env
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Error: La variable de entorno GOOGLE_API_KEY no está configurada en el archivo .env.")
        
        genai.configure(api_key=api_key)
        # Usamos el modelo Flash por su ultra-baja latencia y soporte multimodal de audio
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def analyze(self, audio_bytes: bytes, content_type: str | None = None) -> AnalysisResult:
        if not audio_bytes:
            raise ValueError("El archivo de audio está vacío.")

        # Forzar un tipo de contenido válido si llega genérico desde el dispositivo móvil
        if not content_type or content_type == "application/octet-stream":
            content_type = "audio/wav"

        # Le damos un rol estricto a Gemini enfocado puramente en acústica e idioma español
        prompt = (
            "Actúa como un experto en ciberseguridad forense de audio. Tu tarea es analizar acústicamente este archivo de voz "
            "para determinar si es una voz humana real o una voz sintética/clonada por Inteligencia Artificial (Deepfake).\n\n"
            "Enfócate estrictamente en características físicas del sonido: artefactos digitales ocultos, respuestas de frecuencia, "
            "patrones semánticos anómalos en español y la fluidez acústica natural.\n\n"
            "DEBES responder única y estrictamente con un objeto JSON que cumpla el siguiente formato, sin textos adicionales ni marcas markdown:\n"
            "{\n"
            '  "human_probability": <número entero de 0 a 100>,\n'
            '  "ai_probability": <número entero de 0 a 100>,\n'
            '  "risk_level": <"Bajo", "Medio" o "Alto">,\n'
            '  "message": "<Una breve explicación analítica de 2 líneas en español detallando qué anomalías acústicas encontraste>"\n'
            "}\n"
            "Nota crucial: Asegúrate de que la suma de 'human_probability' y 'ai_probability' sea exactamente 100."
        )

        try:
            # Estructuramos los bytes directamente en línea para no lidiar con subidas persistentes
            audio_part = {
                "mime_type": content_type,
                "data": audio_bytes
            }

            # Obligamos a Gemini a responder en un formato JSON estricto para evitar errores de parseo
            response = self.model.generate_content(
                [prompt, audio_part],
                generation_config={"response_mime_type": "application/json"}
            )

            # Convertimos la respuesta de texto a diccionario de Python
            data = json.loads(response.text)

            return AnalysisResult(
                human_probability=int(data.get("human_probability", 50)),
                ai_probability=int(data.get("ai_probability", 50)),
                risk_level=str(data.get("risk_level", "Medio")),
                message=str(data.get("message", "Análisis acústico finalizado.")),
            )

        except Exception as e:
            # Fallback seguro por si ocurre un timeout o error de red con la API
            return AnalysisResult(
                human_probability=50,
                ai_probability=50,
                risk_level="Medio",
                message=f"Error en el procesamiento de la API acústica: {str(e)}"
            )