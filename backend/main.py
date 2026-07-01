from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from librosa_analyzer import AnalysisResult, LibrosaVoiceAnalyzer

app = FastAPI(title="VoiceShield AI API (Librosa)", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    audio_bytes = await file.read()

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="No se recibió contenido de audio.")

    try:
        result: AnalysisResult = analyzer.analyze(audio_bytes, file.content_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "human_probability": result.human_probability,
        "ai_probability": result.ai_probability,
        "risk_level": result.risk_level,
        "message": result.message,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
