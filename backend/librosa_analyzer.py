import io
import numpy as np
import librosa
import logging
from dataclasses import dataclass

# Configuramos el logger para ver los errores reales en la terminal de Uvicorn
logger = logging.getLogger("uvicorn.error")

@dataclass(frozen=True)
class AnalysisResult:
    human_probability: int
    ai_probability: int
    risk_level: str
    message: str

class LibrosaVoiceAnalyzer:
    """Detecta voces sintéticas analizando características acústicas del espectrograma"""
    
    def __init__(self):
        self.sr = 16000  # Sample rate estándar
    
    def analyze(self, audio_bytes: bytes, content_type: str | None = None) -> AnalysisResult:
        if not audio_bytes:
            raise ValueError("Audio vacío")
        
        try:
            # 1. Detectar si el archivo es un formato comprimido (M4A/AAC) común en móviles
            is_compressed = False
            if content_type:
                ct_lower = content_type.lower()
                if "m4a" in ct_lower or "aac" in ct_lower or "audio/x-m4a" in ct_lower:
                    is_compressed = True

            # 2. Decodificación inteligente del contenedor de audio
            if is_compressed:
                try:
                    from pydub import AudioSegment
                    # Convertimos los bytes m4a a un WAV temporal en memoria antes de pasarlo a librosa
                    sound = AudioSegment.from_file(io.BytesIO(audio_bytes), format="m4a")
                    wav_io = io.BytesIO()
                    sound.export(wav_io, format="wav")
                    wav_io.seek(0)
                    audio, sr = librosa.load(wav_io, sr=self.sr, mono=True)
                except ImportError:
                    logger.error("¡Alerta! 'pydub' no está instalado. Intentando carga directa fallback.")
                    audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=self.sr, mono=True)
            else:
                try:
                    # Intento de carga directa estándar (WAV, MP3)
                    audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=self.sr, mono=True)
                except Exception as load_err:
                    # Rescate de emergencia: si librosa falla, intentamos que pydub lo procese de forma genérica
                    logger.warning(f"Librosa falló en carga directa ({load_err}). Intentando rescate con pydub...")
                    from pydub import AudioSegment
                    sound = AudioSegment.from_file(io.BytesIO(audio_bytes))
                    wav_io = io.BytesIO()
                    sound.export(wav_io, format="wav")
                    wav_io.seek(0)
                    audio, sr = librosa.load(wav_io, sr=self.sr, mono=True)
            
            # 3. Extracción de características acústicas
            features = self._extract_features(audio, sr)
            
            # 4. Clasificación heurística
            human_prob, ai_prob = self._classify(features)
            risk = self._risk_level(ai_prob)
            
            return AnalysisResult(
                human_probability=int(human_prob),
                ai_probability=int(ai_prob),
                risk_level=risk,
                message=self._message(features, ai_prob)
            )
            
        except Exception as e:
            # Imprime el error completo y su traza en la terminal del backend para que no vayas a ciegas
            logger.error(f"¡Error crítico en el procesamiento de audio!: {str(e)}", exc_info=True)
            return AnalysisResult(50, 50, "Medio", f"Error crítico de procesamiento: {str(e)}")
    
    def _extract_features(self, audio, sr):
        """Extrae características de espectrograma"""
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)
        
        spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)[0]
        cent_mean = np.mean(spectral_centroid)
        cent_std = np.std(spectral_centroid)
        
        zcr = librosa.feature.zero_crossing_rate(audio)[0]
        zcr_mean = np.mean(zcr)
        
        rms = librosa.feature.rms(y=audio)[0]
        rms_mean = np.mean(rms)
        rms_std = np.std(rms)
        
        silence_ratio = np.sum(np.abs(audio) < 0.01) / len(audio)
        
        return {
            'mfcc_mean': mfcc_mean,
            'mfcc_std': mfcc_std,
            'cent_mean': cent_mean,
            'cent_std': cent_std,
            'zcr_mean': zcr_mean,
            'rms_mean': rms_mean,
            'rms_std': rms_std,
            'silence_ratio': silence_ratio
        }
    
    def _classify(self, features):
        """Clasificador basado en heurísticas acústicas"""
        score = 0
        
        mfcc_variability = np.mean(features['mfcc_std'])
        if mfcc_variability < 2.5:
            score += 25
        
        if features['cent_std'] < 500:
            score += 20
        
        if features['zcr_mean'] < 0.08:
            score += 20
        
        if features['rms_std'] < 0.01:
            score += 15
        
        if features['silence_ratio'] > 0.2:
            score += 10
        
        ai_prob = min(int(score), 100)
        human_prob = 100 - ai_prob
        
        return human_prob, ai_prob
    
    def _risk_level(self, ai_prob):
        if ai_prob >= 70:
            return "Alto"
        elif ai_prob >= 40:
            return "Medio"
        else:
            return "Bajo"
    
    def _message(self, features, ai_prob):
        if ai_prob >= 70:
            return f"Voz sintética detectada. Espectrograma uniforme. Baja variabilidad MFCC."
        elif ai_prob >= 40:
            return f"Características ambiguas. Podría ser voz clonada o humana con distorsión."
        else:
            return f"Voz humana identificada. Variabilidad acústica natural detectada."