import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

export default function DetailsScreen({ analysisResult, setCurrentScreen }) {
  const metricas = analysisResult?.metricas || {};
  const transcripcion = analysisResult?.transcripcion_whisper || '';
  const forense = analysisResult?.analisis_forense || {};
  const tacticas = analysisResult?.desglose_tacticas || {};
  const whisperDetalles = analysisResult?.detalles_audio_whisper || {};
  const recomendaciones = analysisResult?.recomendaciones_seguridad || [];
  const analisisSocialRaw = analysisResult?.analisis_social || {};

  const renderProgressBar = (percentage, colorTheme) => {
    const validPercent = Math.max(0, min(percentage || 0, 100));
    return (
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${validPercent}%`, backgroundColor: colorTheme }]} />
      </View>
    );
  };

  function min(a, b) { return a > b ? b : a; }

  const getSeverityColor = (score) => {
    if (score >= 75) return '#DC2626'; 
    if (score >= 45) return '#D97706'; 
    return '#16A34A';
  };

  const globalColor = getSeverityColor(metricas.riesgo_global);

  return (
    <View style={styles.container}>
      {/* HEADER DE LA PANTALLA */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('MAIN')}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informe Pericial Avanzado</Text>
        <View style={{ width: 65 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN 1: DICTAMEN INTEGRADO GLOBAL */}
        <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: globalColor }]}>
          <Text style={styles.cardContextLabel}>MOTOR CORRELATIVO GENERAL</Text>
          <Text style={styles.mainGlobalTitle}>Evaluación Unificada de Riesgo</Text>
          
          <View style={styles.globalContainer}>
            <View style={[styles.globalCircularBadge, { borderColor: globalColor }]}>
              <Text style={[styles.globalPercentageText, { color: globalColor }]}>{metricas.riesgo_global || 0}%</Text>
              <Text style={styles.globalLabelSub}>ÍNDICE</Text>
            </View>
            <View style={styles.globalTextRight}>
              <Text style={styles.veredictoLabel}>DIAGNÓSTICO:</Text>
              <Text style={[styles.veredictoValue, { color: globalColor }]}>{metricas.nivel || 'INDETERMINADO'}</Text>
            </View>
          </View>

          {/* RECOMENDACIONES DINÁMICAS FLUIDAS DESDE EL BACKEND */}
          {recomendaciones.length > 0 && (
            <View style={styles.recoContainer}>
              <Text style={styles.innerSectionTitle}>📋 Protocolo de Mitigación Sugerido:</Text>
              {recomendaciones.map((rec, index) => (
                <Text key={index} style={styles.recoItem}>• {rec}</Text>
              ))}
            </View>
          )}
        </View>

        {/* SECCIÓN 2: BIOMETRÍA ACÚSTICA FORENSE (MOTOR 1) */}
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <Text style={styles.motorIcon}>🔍</Text>
            <View>
              <Text style={styles.sectionTitle}>Biometría de Voz por IA</Text>
              <Text style={styles.sectionSubtitle}>Detección de clonación neuronal de audio</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.metricRowBlock}>
            <View style={styles.metricRowHeader}>
              <Text style={styles.metricLabelLarge}>Riesgo Consolidado de Clonación:</Text>
              <Text style={[styles.metricValueLarge, { color: getSeverityColor(metricas.motor1_voz_ia) }]}>
                {metricas.motor1_voz_ia !== undefined ? `${metricas.motor1_voz_ia}%` : '0%'}
              </Text>
            </View>
            {renderProgressBar(metricas.motor1_voz_ia, getSeverityColor(metricas.motor1_voz_ia))}
            <Text style={styles.conclucionTexto}>Interpretación: {metricas.nivel_confianza_voz || 'N/A'}</Text>
          </View>

          <Text style={styles.innerSectionTitle}>🔬 Evidencia del Modelo Matemático</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Modelo:</Text><Text style={styles.gridValue} numberOfLines={1}>{forense.modelo || 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Prob. Fake Cruda:</Text><Text style={styles.gridValue}>{forense.score_modelo !== undefined ? `${forense.score_modelo.toFixed(2)}%` : 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Probabilidad Real:</Text><Text style={styles.gridValue}>{forense.prob_real !== undefined ? `${(forense.prob_real * 100).toFixed(1)}%` : 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Probabilidad Fake:</Text><Text style={styles.gridValue}>{forense.prob_fake !== undefined ? `${(forense.prob_fake * 100).toFixed(1)}%` : 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Margen Decisión:</Text><Text style={styles.gridValue}>{forense.margen_decision !== undefined ? forense.margen_decision.toFixed(3) : 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Umbral Decisión:</Text><Text style={styles.gridValue}>{forense.umbral_decision !== undefined ? forense.umbral_decision : 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Dispositivo:</Text><Text style={styles.gridValue}>{forense.dispositivo || 'N/A'}</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Estado IA:</Text><Text style={styles.gridValue}>{forense.modelo_disponible ? 'Operativa' : 'Contingencia'}</Text></View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>⚠️ {forense.advertencia}</Text>
          </View>
        </View>

        {/* SECCIÓN 3: CAPA ANALÍTICA DE INGENIERÍA SOCIAL (MOTOR 3) */}
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <Text style={styles.motorIcon}>🧠</Text>
            <View>
              <Text style={styles.sectionTitle}>Ingeniería Social Psicológica</Text>
              <Text style={styles.sectionSubtitle}>Análisis semántico zero-shot NLP</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.metricRowBlock}>
            <View style={styles.metricRowHeader}>
              <Text style={styles.metricLabelLarge}>Índice de Persuasión Maliciosa:</Text>
              <Text style={[styles.metricValueLarge, { color: getSeverityColor(metricas.motor3_ingenieria_social) }]}>
                {metricas.motor3_ingenieria_social !== undefined ? `${metricas.motor3_ingenieria_social}%` : '0%'}
              </Text>
            </View>
            {renderProgressBar(metricas.motor3_ingenieria_social, getSeverityColor(metricas.motor3_ingenieria_social))}
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Fraude Detectado:</Text>
              <Text style={[styles.gridValue, { color: analisisSocialRaw.fraude_detectado ? '#DC2626' : '#16A34A', fontWeight: 'bold' }]}>
                {analisisSocialRaw.fraude_detectado ? 'SÍ' : 'NO'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Confianza Fraude:</Text>
              <Text style={styles.gridValue}>{analisisSocialRaw.confianza_fraude || 0}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Severidad Social:</Text>
              <Text style={styles.gridValue}>{analisisSocialRaw.nivel_riesgo || 'BAJO'}</Text>
            </View>
          </View>

          <Text style={[styles.innerSectionTitle, { marginTop: 14 }]}>🎯 Vectores de Ataque Identificados:</Text>
          {Object.entries(tacticas).filter(([_, val]) => val > 0).length > 0 ? (
            Object.entries(tacticas).map(([key, value]) => (
              value > 0 ? (
                <View key={key} style={styles.tacticaRowBlock}>
                  <View style={styles.tacticaInfoRow}>
                    <Text style={styles.tacticaLabelText}>• {key.replace(/_/g, ' ')}</Text>
                    <Text style={styles.tacticaValueText}>{value}%</Text>
                  </View>
                  {renderProgressBar(value, '#EF4444')}
                </View>
              ) : null
            ))
          ) : (
            <Text style={styles.noDataText}>No se identificaron patrones léxicos de coacción o manipulación explícita.</Text>
          )}
        </View>

        {/* SECCIÓN 4: ANALÍTICA TEMPORAL ACÚSTICA (MOTOR 2 - WHISPER METRICS) */}
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <Text style={styles.motorIcon}>📊</Text>
            <View>
              <Text style={styles.sectionTitle}>Métricas Forenses del Audio</Text>
              <Text style={styles.sectionSubtitle}>Estructura física y pausas de habla extraídas</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Duración Archivo:</Text>
              <Text style={styles.gridValue}>{whisperDetalles.duracion_fisica_archivo_segundos || 0}s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Habla Efectiva:</Text>
              <Text style={styles.gridValue}>{whisperDetalles.duracion_actividad_habla_segundos || 0}s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tiempo Silencio:</Text>
              <Text style={styles.gridValue}>{whisperDetalles.tiempo_inactividad_silencio_segundos || 0}s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Porcentaje Silencio:</Text>
              <Text style={[styles.gridValue, { color: '#2563EB' }]}>{whisperDetalles.porcentaje_silencio_llamada || 0}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Ritmo Verbal:</Text>
              <Text style={styles.gridValue}>{whisperDetalles.densidad_habla_palabras_por_segundo || 0} pal/s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Total Fragmentos:</Text>
              <Text style={styles.gridValue}>{whisperDetalles.total_fragmentos_deteccion || 0} ráfagas</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN 5: TRANSCRIPCIÓN LITERAL NUMÉRICA */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Transcripción Estructural de Evidencia</Text>
          <Text style={styles.sectionSubtitle}>Decodificación neuronal realizada mediante Whisper Engine</Text>
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptText}>
              {transcripcion ? `"${transcripcion}"` : 'El motor pericial no recuperó muestras legibles de habla.'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 50, 
    paddingBottom: 16, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  backButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#F1F5F9' },
  backButtonText: { color: '#0F172A', fontWeight: '700', fontSize: 13 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: 0.3 },
  scrollContent: { padding: 16 },
  
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 16, 
    elevation: 3, 
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 6 
  },
  cardContextLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 2 },
  mainGlobalTitle: { fontSize: 19, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  
  globalContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  globalCircularBadge: { 
    width: 85, 
    height: 85, 
    borderRadius: 42.5, 
    borderWidth: 5, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  globalPercentageText: { fontSize: 24, fontWeight: '900' },
  globalLabelSub: { fontSize: 8, fontWeight: '700', color: '#64748B', marginTop: -2 },
  globalTextRight: { marginLeft: 20, flex: 1 },
  veredictoLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 0.5 },
  veredictoValue: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  
  recoContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  recoItem: { fontSize: 12.5, color: '#334155', lineHeight: 18, marginTop: 6, fontWeight: '500' },

  rowHeader: { flexDirection: 'row', alignItems: 'center' },
  motorIcon: { fontSize: 24, marginRight: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 11.5, color: '#64748B', marginTop: 1 },
  innerSectionTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 10, marginTop: 14, letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  
  metricRowBlock: { marginBottom: 12 },
  metricRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  metricLabelLarge: { fontSize: 13, fontWeight: '700', color: '#475569' },
  metricValueLarge: { fontSize: 15, fontWeight: '800' },
  progressTrack: { height: 7, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginVertical: 4 },
  progressFill: { height: '100%', borderRadius: 4 },
  conclucionTexto: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 4 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginTop: 4 },
  gridItem: { width: '50%', padding: 4 },
  gridLabel: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  gridValue: { fontSize: 12.5, fontWeight: '700', color: '#0F172A', marginTop: 1, backgroundColor: '#F8FAFC', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },

  tacticaRowBlock: { marginBottom: 10 },
  tacticaInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  tacticaLabelText: { fontSize: 12.5, color: '#334155', textTransform: 'capitalize', fontWeight: '600' },
  tacticaValueText: { fontSize: 12.5, color: '#64748B', fontWeight: '700' },
  
  transcriptBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  transcriptText: { fontStyle: 'italic', color: '#334155', lineHeight: 20, fontSize: 13.5 },
  warningBox: { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7', borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 14 },
  warningText: { fontSize: 11, color: '#B45309', lineHeight: 15, fontWeight: '500', textAlign: 'justify' },
  noDataText: { fontSize: 12, fontStyle: 'italic', color: '#94A3B8', paddingVertical: 4 }
});