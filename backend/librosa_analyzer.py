import io
import numpy as np
import librosa
from dataclasses import dataclass
from pydub import AudioSegment

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
            # Corregido: Detectar formatos comprimidos de móviles y transformarlos a WAV en memoria
            if content_type and any(fmt in content_type.lower() for fmt in ['m4a', 'aac', 'mp4']):
                try:
                    sound = AudioSegment.from_file(io.BytesIO(audio_bytes), format="m4a")
                    wav_io = io.BytesIO()
                    sound.export(wav_io, format="wav")
                    wav_io.seek(0)
                    audio, sr = librosa.load(wav_io, sr=self.sr, mono=True)
                except Exception as pydub_err:
                    raise ValueError(f"Decodificación m4a falló: {str(pydub_err)}")
            else:
                # Fallback: intentar carga directa para formatos planos estándar (wav, mp3, etc)
                audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=self.sr, mono=True)
            
            # Extraer características acústicas
            features = self._extract_features(audio, sr)
            
            # Clasificar
            human_prob, ai_prob = self._classify(features)
            risk = self._risk_level(ai_prob)
            
            return AnalysisResult(
                human_probability=int(human_prob),
                ai_probability=int(ai_prob),
                risk_level=risk,
                message=self._message(features, ai_prob)
            )
        except Exception as e:
            # Corregido: Eliminada la captura silenciosa que retornaba 50/50. Ahora loguea e informa el error real
            import logging
            logging.error(f"Audio analyze failed: {str(e)}", exc_info=True)
            raise ValueError(f"Decodificación audio falló: {str(e)}")
    
    def _extract_features(self, audio, sr):
        """Extrae características de espectrograma"""
        # MFCC - coeficientes melescala
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)
        
        # Centroide espectral
        spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)[0]
        cent_mean = np.mean(spectral_centroid)
        cent_std = np.std(spectral_centroid)
        
        # Zero crossing rate - detecta cambios abruptos (artificial)
        zcr = librosa.feature.zero_crossing_rate(audio)[0]
        zcr_mean = np.mean(zcr)
        
        # Energía RMS - variación amplitud
        rms = librosa.feature.rms(y=audio)[0]
        rms_mean = np.mean(rms)
        rms_std = np.std(rms)
        
        # Detección silencio - voces sintéticas suelen tener silencio artificial
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
        
        # Voces sintéticas tienen MFCC más uniformes (menos variación)
        mfcc_variability = np.mean(features['mfcc_std'])
        if mfcc_variability < 2.5:
            score += 25
        
        # Centroide espectral más estable (artificial)
        if features['cent_std'] < 500:
            score += 20
        
        # Zero crossing muy bajo = voz más robótica
        if features['zcr_mean'] < 0.08:
            score += 20
        
        # Energía RMS muy constante = generada
        if features['rms_std'] < 0.01:
            score += 15
        
        # Silencio artificial
        if features['silence_ratio'] > 0.2:
            score += 10
        
        # Normalizar 0-100
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