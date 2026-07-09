import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';

const THEME = {
  color: {
    bg: '#1E293B',
    surface: '#0F172A',
    surfaceAlt: '#1E293B',
    border: '#334155',
    borderSoft: '#1E293B',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    onDark: '#FFFFFF',
    onDarkMuted: '#94A3B8',
    primary: '#38BDF8',
    primaryDeep: '#0A42BA',
    primarySoft: '#1E293B',
    primaryBorder: '#334155',
    success: '#10B981',
    successSoft: '#064E3B',
    successBorder: '#059669',
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

export default function MainScreen({
  pickDocument,
  uploadAudio,
  selectedFile,
  analysisResult,
  loading,
  loadingStatus,
  handleLogout,
  userData,
  setCurrentScreen,
  history = [], 
  onSelectHistoryItem
}) {
  
  const recentHistory = history.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.eyebrow}>SESIÓN ACTIVA</Text>
          <Text style={styles.welcomeText}>
            {userData ? `Hola, ${userData.nombre}` : 'Modo Invitado'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {userData ? 'Tu historial se guardará de forma segura' : 'Análisis temporal activo'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PANEL PRINCIPAL DE CARGA */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>🛡️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Analizar Audio Forense</Text>
              <Text style={styles.cardDescription}>
                Selecciona un archivo de audio para verificar su autenticidad y detectar posibles suplantaciones.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.pickButton} onPress={pickDocument} activeOpacity={0.75}>
            <Text style={styles.pickButtonText}>
              {selectedFile ? '🔄 Cambiar archivo de audio' : '📁 Seleccionar archivo'}
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileContainer}>
              <View style={styles.fileDot} />
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile.name || 'Archivo seleccionado'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.analyzeButton, (!selectedFile || loading) && styles.disabledButton]}
            onPress={uploadAudio}
            disabled={!selectedFile || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator color={THEME.color.onDark} size="small" style={{ marginBottom: 6 }} />
                <Text style={styles.loadingStatusText}>{loadingStatus}</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>Iniciar Verificación Segura</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* VEREDICTO DINÁMICO */}
        {analysisResult && !selectedFile && !loading && (
          <View style={styles.card}>
            <Text style={styles.eyebrowCenter}>VEREDICTO DEL ANÁLISIS EN CURSO</Text>

            <View style={[
              styles.riskBadge,
              analysisResult.metricas?.riesgo_global < 35 ? styles.badgeSuccess : styles.badgeDanger
            ]}>
              <View style={[
                styles.riskDot,
                { backgroundColor: analysisResult.metricas?.riesgo_global < 35 ? THEME.color.success : THEME.color.danger }
              ]} />
              <Text style={[
                styles.riskBadgeText,
                { color: analysisResult.metricas?.riesgo_global < 35 ? THEME.color.success : THEME.color.danger }
              ]}>
                {analysisResult.metricas?.nivel || 'Evaluando'}
              </Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionSubtitle}>Detalles de los Motores Forenses</Text>

            <View style={styles.motorRow}>
              <Text style={styles.motorName}>Detección Deepfake</Text>
              <Text style={styles.motorValue}>
                {analysisResult.metricas?.motor1_voz_ia !== undefined ? `${analysisResult.metricas.motor1_voz_ia}%` : 'N/A'}
              </Text>
            </View>

            <View style={styles.motorRow}>
              <Text style={styles.motorName}>Ingeniería Social</Text>
              <Text style={styles.motorValue}>
                {analysisResult.metricas?.motor3_ingenieria_social !== undefined ? `${analysisResult.metricas.motor3_ingenieria_social}%` : 'N/A'}
              </Text>
            </View>

            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptTitle}>Transcripción de Audio</Text>
              <Text style={styles.transcriptText}>
                {analysisResult.transcripcion_whisper ? `"${analysisResult.transcripcion_whisper}"` : 'No se detectó texto en el archivo.'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => setCurrentScreen('DETAILS')}
              activeOpacity={0.75}
            >
              <Text style={styles.detailsButtonText}>Ver informe avanzado</Text>
              <Text style={styles.detailsButtonArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TARJETA ELEGANTE INTERMEDIA */}
        {analysisResult && selectedFile && !loading && (
          <View style={styles.historyContainer}>
            <Text style={styles.historySectionTitle}>Resultado del Análisis Anterior</Text>
            <TouchableOpacity 
              style={styles.previousAnalysisCard}
              onPress={() => setCurrentScreen('DETAILS')}
              activeOpacity={0.8}
            >
              <View style={styles.historyInfo}>
                <Text style={styles.historyName} numberOfLines={1}>
                  📊 Informe Listo para Ver
                </Text>
                <Text style={styles.historyDate}>
                  Pulsa aquí para ver el desglose técnico completo
                </Text>
              </View>
              <View style={[
                styles.historyBadge,
                analysisResult.metricas?.riesgo_global < 35 ? styles.badgeSuccess : styles.badgeDanger
              ]}>
                <Text style={[
                  styles.historyBadgeText,
                  { color: analysisResult.metricas?.riesgo_global < 35 ? THEME.color.success : THEME.color.danger }
                ]}>
                  {analysisResult.metricas?.nivel || 'Completado'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* HISTORIAL RECIENTE GENERAL */}
        {recentHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historySectionTitle}>Análisis Recientes Guardados</Text>
            {recentHistory.map((item, index) => {
              const isSafe = item.metricas?.riesgo_global < 35;
              return (
                <TouchableOpacity 
                  key={item.id || index} 
                  style={styles.historyCard}
                  onPress={() => onSelectHistoryItem ? onSelectHistoryItem(item) : setCurrentScreen('DETAILS')}
                  activeOpacity={0.8}
                >
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName} numberOfLines={1}>
                      {item.nombre_archivo || `Audio_Analizado_${index + 1}.mp3`}
                    </Text>
                    <Text style={styles.historyDate}>
                      {item.fecha || 'Recién verificado'}
                    </Text>
                  </View>
                  <View style={[
                    styles.historyBadge,
                    isSafe ? styles.badgeSuccess : styles.badgeDanger
                  ]}>
                    <Text style={[
                      styles.historyBadgeText,
                      { color: isSafe ? THEME.color.success : THEME.color.danger }
                    ]}>
                      {item.metricas?.nivel || 'Analizado'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.color.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.space.xxl,
    paddingTop: 56,
    paddingBottom: THEME.space.lg,
    backgroundColor: THEME.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.color.border,
  },
  userInfo: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: '800', color: THEME.color.primary, letterSpacing: 1.5, marginBottom: 4 },
  eyebrowCenter: { fontSize: 11, fontWeight: '800', color: THEME.color.primary, letterSpacing: 1.5, textAlign: 'center', marginBottom: THEME.space.md },
  welcomeText: { fontSize: 22, fontWeight: '700', color: THEME.color.textPrimary, letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: THEME.color.textSecondary, marginTop: 2 },
  logoutButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: THEME.radius.sm, backgroundColor: THEME.color.surfaceAlt, borderWidth: 1, borderColor: THEME.color.border },
  logoutText: { color: THEME.color.textPrimary, fontWeight: '600', fontSize: 13 },
  scrollContent: { padding: THEME.space.xxl },
  card: { backgroundColor: THEME.color.surface, borderRadius: THEME.radius.lg, padding: THEME.space.xxl, marginBottom: THEME.space.xl, borderWidth: 1, borderColor: THEME.color.border, ...THEME.shadow },
  cardTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconBadge: { width: 40, height: 40, borderRadius: THEME.radius.sm, backgroundColor: THEME.color.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: THEME.space.md, borderWidth: 1, borderColor: THEME.color.border },
  iconBadgeText: { fontSize: 18 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: THEME.color.textPrimary, marginBottom: 4, letterSpacing: -0.2 },
  cardDescription: { fontSize: 13.5, color: THEME.color.textSecondary, lineHeight: 20 },
  pickButton: { backgroundColor: THEME.color.surfaceAlt, paddingVertical: 14, borderRadius: THEME.radius.sm, alignItems: 'center', marginTop: THEME.space.xl, marginBottom: THEME.space.md, borderWidth: 1, borderColor: THEME.color.border },
  pickButtonText: { color: THEME.color.primary, fontWeight: '600', fontSize: 14 },
  fileContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.color.surfaceAlt, paddingVertical: 10, paddingHorizontal: 12, borderRadius: THEME.radius.sm, marginBottom: THEME.space.lg, borderWidth: 1, borderColor: THEME.color.border },
  fileDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.color.success, marginRight: 9 },
  fileName: { color: THEME.color.textPrimary, fontSize: 13, fontWeight: '500', flex: 1 },
  analyzeButton: { backgroundColor: THEME.color.primaryDeep, paddingVertical: 16, borderRadius: THEME.radius.sm, alignItems: 'center' },
  analyzeButtonText: { color: THEME.color.onDark, fontWeight: '600', fontSize: 15 },
  disabledButton: { backgroundColor: '#475569' },
  loadingWrapper: { alignItems: 'center', width: '100%' },
  loadingStatusText: { color: THEME.color.onDarkMuted, fontSize: 12, textAlign: 'center', fontWeight: '400', marginTop: 4 },
  riskBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: THEME.radius.sm, marginBottom: THEME.space.lg, borderWidth: 1 },
  badgeSuccess: { backgroundColor: THEME.color.successSoft, borderColor: THEME.color.successBorder },
  badgeDanger: { backgroundColor: THEME.color.dangerSoft, borderColor: THEME.color.dangerBorder },
  riskDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  riskBadgeText: { fontWeight: '700', fontSize: 14.5, letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: THEME.color.border, marginVertical: THEME.space.md },
  sectionSubtitle: { fontSize: 13, fontWeight: '700', color: THEME.color.textPrimary, marginBottom: THEME.space.md },
  motorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.color.border },
  motorName: { color: THEME.color.textSecondary, fontSize: 13.5 },
  motorValue: { fontWeight: '600', color: THEME.color.textPrimary, fontSize: 13.5 },
  transcriptBox: { backgroundColor: THEME.color.surfaceAlt, padding: THEME.space.md, borderRadius: THEME.radius.sm, marginTop: THEME.space.lg, marginBottom: THEME.space.md, borderWidth: 1, borderColor: THEME.color.border },
  transcriptTitle: { fontSize: 12, fontWeight: '700', color: THEME.color.textPrimary, marginBottom: 4 },
  transcriptText: { fontStyle: 'italic', color: THEME.color.textSecondary, lineHeight: 18, fontSize: 13 },
  detailsButton: { flexDirection: 'row', paddingVertical: 14, borderRadius: THEME.radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME.color.primary, marginTop: THEME.space.sm },
  detailsButtonText: { color: THEME.color.primary, fontWeight: '600', fontSize: 14 },
  detailsButtonArrow: { color: THEME.color.primary, fontWeight: '600', fontSize: 14, marginLeft: 6 },
  historyContainer: { marginTop: THEME.space.xs, marginBottom: THEME.space.xxl },
  historySectionTitle: { fontSize: 14, fontWeight: '700', color: THEME.color.textSecondary, marginBottom: THEME.space.md, letterSpacing: 0.3 },
  previousAnalysisCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.color.surface, padding: THEME.space.md, borderRadius: THEME.radius.md, marginBottom: THEME.space.sm, borderWidth: 2, borderColor: THEME.color.primary, ...THEME.shadow },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.color.surface, padding: THEME.space.md, borderRadius: THEME.radius.md, marginBottom: THEME.space.sm, borderWidth: 1, borderColor: THEME.color.border, ...THEME.shadow },
  historyInfo: { flex: 1, paddingRight: THEME.space.md },
  historyName: { fontSize: 13.5, fontWeight: '600', color: THEME.color.textPrimary },
  historyDate: { fontSize: 11, color: THEME.color.textSecondary, marginTop: 2 },
  historyBadge: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: THEME.radius.sm, borderWidth: 1 },
  historyBadgeText: { fontSize: 12, fontWeight: '600' },
});