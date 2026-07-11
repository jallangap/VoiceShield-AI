import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native';

// PALETA INSTITUCIONAL OSCURA INTEGRADA (GuardIAn)
const THEME = {
  color: {
    bg: '#000000', 
    surface: '#171717',     
    surfaceAlt: '#232323',  
    border: '#DDDDDD',     
    borderSoft: '#1E293B',

    textPrimary: '#FFFFFF', 
    textSecondary: '#C5C5C5', 
    textMuted: '#8A8A8A',
    onDark: '#FFFFFF',

    primary: '#38BDF8',  
    primaryDeep: '#0A42BA', 
    primarySoft: '#1E293B',
    primaryBorder: '#334155',

    success: '#10B981',
    successSoft: '#064E3B',
    successBorder: '#059669',

    warning: '#F59E0B',
    warningSoft: '#453517',
    warningBorder: '#D97706',

    danger: '#EF4444',
    dangerSoft: '#451A23',
    dangerBorder: '#DC2626',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  shadow: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
};

export default function DetailsScreen({ analysisResult, setCurrentScreen }) {
  const metricas = analysisResult?.metricas || {};
  const transcripcion = analysisResult?.transcripcion_whisper || '';
  const forense = analysisResult?.analisis_forense || {};
  const tacticas = analysisResult?.desglose_tacticas || {};
  const whisperDetalles = analysisResult?.detalles_audio_whisper || {};
  const recomendaciones = Array.isArray(
    analysisResult?.recomendaciones_seguridad
  )
    ? analysisResult.recomendaciones_seguridad
    : [];
  const analisisSocialRaw = analysisResult?.analisis_social || {};

  const renderProgressBar = (percentage, colorTheme) => {
  const validPercent = Math.max(0, Math.min(percentage || 0, 100));

  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${validPercent}%`,
            backgroundColor: colorTheme,
          },
        ]}
      />
    </View>
  );
};

  const getSeverityColor = (score) => {
    if (score >= 75) return THEME.color.danger;
    if (score >= 40) return THEME.color.warning;
    return THEME.color.success;
  };

  const globalColor = getSeverityColor(metricas.riesgo_global);

  return (
    <ImageBackground
    source={require("../assets/login-bg3.jpg")}
    style={styles.container}
    resizeMode="cover"
  >
    <View style={styles.overlay}>

  <ScrollView
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >

    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentScreen('MAIN')}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        Informe Pericial Avanzado
      </Text>
    </View>

        {/* SECCIÓN 1: DICTAMEN INTEGRADO GLOBAL */}
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: globalColor }]}>
          <Text style={styles.cardContextLabel}>MOTOR CORRELATIVO GENERAL</Text>
          <Text style={styles.mainGlobalTitle}>Evaluación Unificada de Riesgo</Text>

          <View style={styles.globalContainer}>
            <View style={[styles.globalCircularBadge, { borderColor: globalColor }]}>
              <Text style={[styles.globalPercentageText, { color: globalColor }]}>{metricas.riesgo_global || 0}%</Text>
              <Text style={styles.globalLabelSub}>ÍNDICE</Text>
            </View>
            <View style={styles.globalTextRight}>
              <Text style={styles.veredictoLabel}>DIAGNÓSTICO CRIMINALÍSTICO</Text>
              <Text style={[styles.veredictoValue, { color: globalColor }]}>{metricas.nivel || 'INDETERMINADO'}</Text>
            </View>
          </View>

          {/* RECOMENDACIONES DINÁMICAS */}
          {recomendaciones.length > 0 && (
            <View style={styles.recoContainer}>
              <Text style={styles.innerSectionTitle}>📋 Protocolo de Mitigación Sugerido</Text>
              {recomendaciones.map((rec, index) => (
                <View key={index} style={styles.recoRow}>
                  <View style={styles.recoBullet} />
                  <Text style={styles.recoItem}>{rec}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* SECCIÓN 2: BIOMETRÍA ACÚSTICA FORENSE */}
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <View style={styles.motorIconBadge}>
              <Text style={styles.motorIcon}>🔬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Biometría de Voz por IA</Text>
              <Text style={styles.sectionSubtitle}>Detección de clonación neuronal y deepfakes</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.metricRowBlock}>
            <View style={styles.metricRowHeader}>
              <Text style={styles.metricLabelLarge}>Riesgo Consolidado de Clonación</Text>
              <Text style={[styles.metricValueLarge, { color: getSeverityColor(metricas.motor1_voz_ia) }]}>
                {metricas.motor1_voz_ia !== undefined ? `${metricas.motor1_voz_ia}%` : '0%'}
              </Text>
            </View>
            {renderProgressBar(metricas.motor1_voz_ia, getSeverityColor(metricas.motor1_voz_ia))}
            <Text style={styles.conclucionTexto}>Análisis: {metricas.nivel_confianza_voz || 'N/A'}</Text>
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Autenticidad Estimada</Text>
              <Text style={styles.gridValue}>
                {forense.prob_real !== undefined ? `${(forense.prob_real * 100).toFixed(1)}% Real` : 'N/A'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Alteración Artificial</Text>
              <Text style={styles.gridValue}>
                {forense.prob_fake !== undefined ? `${(forense.prob_fake * 100).toFixed(1)}% Sintético` : 'N/A'}
              </Text>
            </View>
          </View>

          {!!forense.advertencia && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>⚠️ {forense.advertencia}</Text>
            </View>
          )}
        </View>

        {/* SECCIÓN 3: CAPA ANALÍTICA DE INGENIERÍA SOCIAL */}
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <View style={styles.motorIconBadge}>
              <Text style={styles.motorIcon}>🧠</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Análisis de Ingeniería Social</Text>
              <Text style={styles.sectionSubtitle}>Detección semántica de intenciones de fraude</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.metricRowBlock}>
            <View style={styles.metricRowHeader}>
              <Text style={styles.metricLabelLarge}>Índice de Coacción o Persuasión Maliciosa</Text>
              <Text style={[styles.metricValueLarge, { color: getSeverityColor(metricas.motor3_ingenieria_social) }]}>
                {metricas.motor3_ingenieria_social !== undefined ? `${metricas.motor3_ingenieria_social}%` : '0%'}
              </Text>
            </View>
            {renderProgressBar(metricas.motor3_ingenieria_social, getSeverityColor(metricas.motor3_ingenieria_social))}
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Patrón de Fraude</Text>
              <Text style={[styles.gridValue, { color: analisisSocialRaw.fraude_detectado ? THEME.color.danger : THEME.color.success, fontWeight: '700' }]}>
                {analisisSocialRaw.fraude_detectado ? 'DETECTADO' : 'NO DETECTADO'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Confianza del Análisis</Text>
              <Text style={styles.gridValue}>{analisisSocialRaw.confianza_fraude || 0}%</Text>
            </View>
          </View>

          <Text style={[styles.innerSectionTitle, { marginTop: THEME.space.md }]}>🎯 Vectores Críticos Identificados</Text>
          {Object.entries(tacticas).filter(([_, val]) => val > 0).length > 0 ? (
            Object.entries(tacticas).map(([key, value]) => (
              value > 0 ? (
                <View key={key} style={styles.tacticaRowBlock}>
                  <View style={styles.tacticaInfoRow}>
                    <Text style={styles.tacticaLabelText}>{key.replace(/_/g, ' ')}</Text>
                    <Text style={styles.tacticaValueText}>{value}%</Text>
                  </View>
                  {renderProgressBar(value, THEME.color.danger)}
                </View>
              ) : null
            ))
          ) : (
            <Text style={styles.noDataText}>No se identificaron indicadores de manipulación psicológica en el discurso.</Text>
          )}
        </View>

        {/* SECCIÓN 4: ESTRUCTURA ACÚSTICA */}
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <View style={styles.motorIconBadge}>
              <Text style={styles.motorIcon}>📊</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Propiedades Físicas del Audio</Text>
              <Text style={styles.sectionSubtitle}>Métricas temporales relevantes extraídas del archivo</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Duración del Archivo</Text>
              <Text style={styles.gridValue}>{whisperDetalles.duracion_fisica_archivo_segundos || 0}s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Voz Activa Efectiva</Text>
              <Text style={styles.gridValue}>{whisperDetalles.duracion_actividad_habla_segundos || 0}s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Porcentaje de Silencios</Text>
              <Text style={[styles.gridValue, { color: THEME.color.primary }]}>{whisperDetalles.porcentaje_silencio_llamada || 0}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Ritmo del Habla</Text>
              <Text style={styles.gridValue}>{whisperDetalles.densidad_habla_palabras_por_segundo || 0} pal/s</Text>
            </View>
          </View>
        </View>

       {/* SECCIÓN 5: TRANSCRIPCIÓN LITERAL */}
<View style={styles.card}>
  <Text style={styles.sectionTitle}>
    Transcripción Estructural de Evidencia
  </Text>

  <Text style={styles.sectionSubtitle}>
    Texto decodificado mediante el motor Whisper
  </Text>

  <View
    style={[
      styles.transcriptBox,
      {
        maxHeight: 1000,
      },
    ]}
  >
    <ScrollView
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
    >
      <Text style={styles.transcriptText}>
        {transcripcion
          ? `"${transcripcion}"`
          : "No se recuperaron muestras legibles de habla."}
      </Text>
    </ScrollView>
  </View>
</View>

</ScrollView>
</View>
</ImageBackground>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,.45)'},
  header:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:60,
    paddingHorizontal:24,
    paddingBottom:20,
},
  backButton:{
    width:115,
    height:50,
    borderRadius:16,
    justifyContent:'center',
    alignItems:'center',

    backgroundColor:'rgba(20,20,20,.95)',

    borderWidth:1.5,
    borderColor:'#D92B2B',
},
  backButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  headerTitle:{
    flex:1,
    marginLeft:18,
    fontSize:28,
    fontWeight:'800',
    color:'#FFF',
},
  scrollContent: { paddingHorizontal:22,paddingBottom:0,paddingTop:15, },

  card:{
    backgroundColor:'#171717',

    borderRadius:28,

    padding:24,

    marginBottom:26,

    borderWidth:1,

    borderColor:'#2A2A2A',

    shadowColor:'#000',
    shadowOpacity:.4,
    shadowRadius:18,
    elevation:10,
},
  cardContextLabel: { fontSize: 10, fontWeight: '800', color: THEME.color.primary, letterSpacing: 1.5, marginBottom: 4 },
  mainGlobalTitle: { fontSize: 18, fontWeight: '700', color: THEME.color.textPrimary, marginBottom: THEME.space.lg },

  globalContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: THEME.space.md },
  globalCircularBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.color.surfaceAlt,
  },
  globalPercentageText: { fontSize: 22, fontWeight: '800' },
  globalLabelSub: { fontSize: 8, fontWeight: '700', color: THEME.color.textSecondary, marginTop: -2 },
  globalTextRight: { marginLeft: THEME.space.xl, flex: 1 },
  veredictoLabel: { fontSize: 10, fontWeight: '800', color: THEME.color.textSecondary, letterSpacing: 1 },
  veredictoValue: { fontSize: 18, fontWeight: '700', marginTop: 2 },

  recoContainer: {
    backgroundColor: THEME.color.surfaceAlt,
    borderRadius: THEME.radius.sm,
    padding: THEME.space.lg,
    marginTop: THEME.space.md,
    borderWidth: 1,
    borderColor: THEME.color.border,
  },
  recoRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: THEME.space.sm },
  recoBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.color.primary,
    marginTop: 6,
    marginRight: 9,
  },
  recoItem: { fontSize: 13, color: THEME.color.textSecondary, lineHeight: 19, flex: 1 },

  rowHeader: { flexDirection: 'row', alignItems: 'center' },
  motorIconBadge: {
    width: 38,
    height: 38,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.color.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.space.md,
    borderWidth: 1,
    borderColor: THEME.color.border,
  },
  motorIcon: { fontSize: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: THEME.color.textPrimary },
  sectionSubtitle: { fontSize: 12, color: THEME.color.textSecondary, marginTop: 1 },
  innerSectionTitle: { fontSize: 13, fontWeight: '700', color: THEME.color.textPrimary, marginBottom: THEME.space.sm, marginTop: THEME.space.lg },
  divider: { height: 1, backgroundColor: THEME.color.border, marginVertical: THEME.space.lg },

  metricRowBlock: { marginBottom: THEME.space.md },
  metricRowHeader: { flexDirection: 'row', justifyContext: 'space-between', alignItems: 'center', marginBottom: THEME.space.sm },
  metricLabelLarge: { fontSize: 13, fontWeight: '600', color: THEME.color.textSecondary, flex: 1 },
  metricValueLarge: { fontSize: 15, fontWeight: '700' },
  progressTrack: { height: 6, width: '100%', backgroundColor: THEME.color.surfaceAlt, borderRadius: 3, overflow: 'hidden', marginVertical: 4 },
  progressFill: { height: '100%', borderRadius: 3 },
  conclucionTexto: { fontSize: 12, color: THEME.color.textSecondary, fontStyle: 'italic', marginTop: 4 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginTop: 4 },
  gridItem: { width: '50%', padding: 4 },
  gridLabel: { fontSize: 11, color: THEME.color.textSecondary, marginBottom: 4, marginLeft: 2 },
  gridValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.color.textPrimary,
    padding: THEME.space.md,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.color.surfaceAlt,
    borderWidth: 1,
    borderColor: THEME.color.border,
  },

  tacticaRowBlock: { marginBottom: THEME.space.sm },
  tacticaInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  tacticaLabelText: { fontSize: 13, color: THEME.color.textPrimary, textTransform: 'capitalize', fontWeight: '500' },
  tacticaValueText: { fontSize: 13, color: THEME.color.textSecondary, fontWeight: '600' },

  transcriptBox: {
  backgroundColor: '#232323',
  borderRadius: 18,
  padding: 18,
  marginTop: 18,
  borderWidth: 1,
  borderColor: '#3A3A3A',
},
  transcriptText: {
  color: '#E8E8E8',
  fontSize: 17,
  lineHeight: 30,
  fontStyle: 'italic',
},
  warningText: { fontSize: 11.5, color: THEME.color.warning, lineHeight: 16, fontWeight: '500' },
  noDataText: { fontSize: 12.5, fontStyle: 'italic', color: THEME.color.textSecondary, paddingVertical: 4 },
});
