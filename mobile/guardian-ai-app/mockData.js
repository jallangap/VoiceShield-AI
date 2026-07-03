
export const mockUser = {
  id: "demo-user-1",
  name: "Usuario Demo",
};

export const mockAudioFile = {
  name: "audio_2026-07-15.opus",
  duration: "0:45",
  size: "1.2 MB",
};

// Simula la respuesta 
export const mockAnalysisResult = {
  riskPercent: 82,
  riskLabel: "RIESGO",
  summary:
    "El remitente solicita una transferencia urgente alegando una emergencia familiar.",
  techniques: [
    { label: "Urgencia", tone: "danger" },
    { label: "Manipulación emocional", tone: "danger" },
    { label: "Presión psicológica", tone: "warning" },
    { label: "Solicitud económica", tone: "warning" },
  ],
  relevantPhrases: [
    "Necesito que lo hagas ahora mismo",
    "No le digas a nadie",
    "Solo tú puedes ayudarme",
  ],
  recommendation:
    "Verifica la identidad del remitente utilizando otro medio de contacto antes de realizar cualquier acción.",
};
