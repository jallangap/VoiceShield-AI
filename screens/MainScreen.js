import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';

export default function MainScreen({
  pickDocument,
  uploadAudio,
  selectedFile,
  analysisResult,
  loading,
  loadingStatus,
  handleLogout,
  userData,
  setCurrentScreen
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛡️ Analizar Audio Forense</Text>
          <Text style={styles.cardDescription}>
            Selecciona un archivo de audio para verificar su autenticidad y detectar posibles engaños.
          </Text>

          <TouchableOpacity style={styles.pickButton} onPress={pickDocument} activeOpacity={0.7}>
            <Text style={styles.pickButtonText}>
              {selectedFile ? '🔄 Cambiar Audio' : '📂 Seleccionar Archivo'}
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileContainer}>
              <Text style={styles.fileName} numberOfLines={1}>
                📄 {selectedFile.name || 'Archivo seleccionado'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.analyzeButton, (!selectedFile || loading) && styles.disabledButton]}
            onPress={uploadAudio}
            disabled={!selectedFile || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator color="#FFFFFF" size="small" style={{ marginBottom: 6 }} />
                <Text style={styles.loadingStatusText}>{loadingStatus}</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>Iniciar Verificación Segura</Text>
            )}
          </TouchableOpacity>
        </View>

        {analysisResult && !loading && (
          <View style={styles.card}>
            <Text style={styles.resultsTitle}>Veredicto del Análisis</Text>
            
            <View style={[
              styles.riskBadge, 
              analysisResult.metricas?.riesgo_global < 35 ? styles.badgeSuccess : styles.badgeDanger
            ]}>
              <Text style={styles.riskBadgeText}>
                Estado: {analysisResult.metricas?.nivel || 'Evaluando'}
              </Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionSubtitle}>Detalles de los Motores Forenses</Text>

            <View style={styles.motorRow}>
              <Text style={styles.motorName}>🔍 Detección Deepfake:</Text>
              <Text style={styles.motorValue}>
                {analysisResult.metricas?.motor1_voz_ia !== undefined ? `${analysisResult.metricas.motor1_voz_ia}%` : 'N/A'}
              </Text>
            </View>

            <View style={styles.motorRow}>
              <Text style={styles.motorName}>🧠 Ingeniería Social:</Text>
              <Text style={styles.motorValue}>
                {analysisResult.metricas?.motor3_ingenieria_social !== undefined ? `${analysisResult.metricas.motor3_ingenieria_social}%` : 'N/A'}
              </Text>
            </View>

            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptTitle}>Transcripción (Whisper):</Text>
              <Text style={styles.transcriptText}>
                {analysisResult.transcripcion_whisper ? `"${analysisResult.transcripcion_whisper}"` : 'No se detectó texto.'}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.detailsButton} 
              onPress={() => setCurrentScreen('DETAILS')}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsButtonText}>📊 Ver informe avanzado</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  userInfo: { flex: 1 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  headerSubtitle: { fontSize: 12, color: '#64748B' },
  logoutButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' },
  logoutText: { color: '#475569', fontWeight: '600' },
  scrollContent: { padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  pickButton: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  pickButtonText: { color: '#2563EB', fontWeight: '600', fontSize: 15 },
  fileContainer: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  fileName: { color: '#334155', fontSize: 13 },
  analyzeButton: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, alignItems: 'center' },
  analyzeButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  disabledButton: { backgroundColor: '#475569' },
  loadingWrapper: { alignItems: 'center', width: '100%' },
  loadingStatusText: { color: '#BFDBFE', fontSize: 11, textAlign: 'center', fontWeight: '500', marginTop: 4, paddingHorizontal: 10 },
  resultsTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  riskBadge: { padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  badgeSuccess: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#BBF7D0' },
  badgeDanger: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  riskBadgeText: { fontWeight: 'bold', fontSize: 15, color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 14 },
  sectionSubtitle: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 10 },
  motorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  motorName: { color: '#64748B', fontSize: 14 },
  motorValue: { fontWeight: '600', color: '#1E293B' },
  transcriptBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginTop: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 },
  transcriptTitle: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 4 },
  transcriptText: { fontStyle: 'italic', color: '#334155', lineHeight: 18 },
  detailsButton: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', marginTop: 10 },
  detailsButtonText: { color: '#1E293B', fontWeight: '600', fontSize: 14 },
});