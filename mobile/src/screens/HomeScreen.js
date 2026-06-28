import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import InfoCard from '../components/InfoCard';
import { colors, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VoiceShield AI</Text>
          </View>
          <Text style={styles.title}>Detecta audio sintético de forma experimental</Text>
          <Text style={styles.subtitle}>
            Graba una voz o selecciona un archivo, envíalo al servidor y revisa una estimación
            simple del riesgo de que haya sido generado con IA.
          </Text>
        </View>

        <InfoCard
          title="Objetivo del MVP"
          subtitle="Demostrar el flujo completo de captura, envío, procesamiento y visualización de resultados."
          accent={colors.cyan}
        >
          <View style={styles.pillRow}>
            <View style={[styles.pill, { borderColor: colors.green }]}>
              <Text style={[styles.pillText, { color: colors.green }]}>Humana</Text>
            </View>
            <View style={[styles.pill, { borderColor: colors.yellow }]}>
              <Text style={[styles.pillText, { color: colors.yellow }]}>Riesgo medio</Text>
            </View>
            <View style={[styles.pill, { borderColor: colors.red }]}>
              <Text style={[styles.pillText, { color: colors.red }]}>IA</Text>
            </View>
          </View>
        </InfoCard>

        <View style={styles.footerCard}>
          <PrimaryButton label="Comenzar un análisis" onPress={() => navigation.navigate('Analisis')} />
          <Text style={styles.note}>
            La clasificación es orientativa y no debe usarse como prueba definitiva.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.md,
    paddingTop: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E1C33',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#214061',
  },
  badgeText: {
    color: colors.cyan,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0B1324',
  },
  pillText: {
    fontWeight: '700',
  },
  footerCard: {
    gap: 12,
    padding: 2,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
