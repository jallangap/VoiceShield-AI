from __future__ import annotations

import os
import tempfile
from dataclasses import dataclass
from functools import lru_cache

import librosa
import torch
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification


MODEL_NAME = os.getenv(
    "VOICE_SHIELD_MODEL_NAME",
    "garystafford/wav2vec2-deepfake-voice-detector",
)
TARGET_SAMPLE_RATE = 16_000
MIN_DURATION_SECONDS = 2.5
MAX_DURATION_SECONDS = 13.0


@dataclass(frozen=True)
class AnalysisResult:
    human_probability: int
    ai_probability: int
    risk_level: str
    message: str


class HuggingFaceVoiceAnalyzer:
    def __init__(self, model_name: str = MODEL_NAME):
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, self.feature_extractor = self._load_model(model_name)
        self.model.to(self.device)
        self.model.eval()

    @staticmethod
    @lru_cache(maxsize=2)
    def _load_model(model_name: str):
        model = AutoModelForAudioClassification.from_pretrained(model_name)
        feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
        return model, feature_extractor

    def analyze(self, audio_bytes: bytes, content_type: str | None = None) -> AnalysisResult:
        if not audio_bytes:
            raise ValueError("El archivo de audio está vacío.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            tmp_file.write(audio_bytes)
            temp_path = tmp_file.name

        try:
            audio, _ = librosa.load(
                temp_path,
                sr=TARGET_SAMPLE_RATE,
                mono=True,
                duration=MAX_DURATION_SECONDS,
            )

            if len(audio) < int(TARGET_SAMPLE_RATE * MIN_DURATION_SECONDS):
                raise ValueError(
                    "El audio es demasiado corto. Usa un clip de al menos 2.5 segundos."
                )

            if len(audio) > int(TARGET_SAMPLE_RATE * MAX_DURATION_SECONDS):
                audio = audio[: int(TARGET_SAMPLE_RATE * MAX_DURATION_SECONDS)]

            inputs = self.feature_extractor(
                audio,
                sampling_rate=TARGET_SAMPLE_RATE,
                return_tensors="pt",
                padding=True,
            )
            inputs = {key: value.to(self.device) for key, value in inputs.items()}

            with torch.no_grad():
                outputs = self.model(**inputs)
                probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)[0]

            prob_real = float(probabilities[0].item())
            prob_fake = float(probabilities[1].item())
            human_probability = int(round(prob_real * 100))
            ai_probability = int(round(prob_fake * 100))

            total = human_probability + ai_probability
            if total != 100:
                human_probability = max(0, min(100, human_probability + (100 - total)))
                ai_probability = 100 - human_probability

            if ai_probability < 35:
                risk_level = "Bajo"
                message = "La voz parece mayormente humana."
            elif ai_probability < 70:
                risk_level = "Medio"
                message = "Se observan indicios mixtos; conviene verificar manualmente."
            else:
                risk_level = "Alto"
                message = "Posible voz sintética detectada."

            return AnalysisResult(
                human_probability=human_probability,
                ai_probability=ai_probability,
                risk_level=risk_level,
                message=message,
            )
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
