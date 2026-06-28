import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoCard from '../components/InfoCard';
import RiskBadge from '../components/RiskBadge';
import StatBar from '../components/StatBar';
import PrimaryButton from '../components/PrimaryButton';
import { useAudioPlayer, useAudioPlayerStatus } from '../services/audio';
import { colors, spacing } from '../theme';

const recommendationMap = {
  Bajo: [
    'Mantén una verificación básica si el audio tiene origen sensible.',
    'Compara con otra fuente si necesitas más contexto.',
  ],
  Medio: [
    'Pide una segunda confirmación por otro canal antes de actuar.',
    'Revisa metadatos, consistencia del habla y contexto de la solicitud.',
  ],
  Alto: [
    'No compartas información sensible solo con base en este audio.',
    'Verifica la identidad por un canal alternativo antes de tomar decisiones.',
    'Considera guardar evidencia y escalar el caso si el contenido es crítico.',
  ],
};

const riskAccent = {
  Bajo: colors.green,
  Medio: colors.yellow,
  Alto: colors.red,
};

export default function ResultsScreen({ route, navigation }) {
  const result = route.params?.result || {};
  const riskLevel = result.risk_level || 'Medio';
  const recommendations = recommendationMap[riskLevel] || recommendationMap.Medio;
  
  const audioUri = route.params?.audioUri || null;
  const player = useAudioPlayer(audioUri);
  const playerStatus = useAudioPlayerStatus(player);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <InfoCard
          title="Resultado del análisis"
          subtitle={result.message || 'Estimación experimental generada por el backend.'}
          accent={riskAccent[riskLevel] || colors.yellow}
        >
          <RiskBadge level={riskLevel} />
          <Text style={styles.disclaimer}>
            Este resultado es orientativo y no reemplaza una verificación forense ni una evaluación
            humana especializada.
          </Text>
          {audioUri && (
            <View style={{ marginTop: 10 }}>
              <PrimaryButton 
                label={playerStatus.playing ? 'Pausar Audio Analizado' : 'Reproducir Audio Analizado'} 
                onPress={() => {
                  if (playerStatus.playing) {
                    player.pause();
                  } else {
                    player.play();
                  }
                }} 
                tone="cyan"
              />
            </View>
          )}
        </InfoCard>

        <View style={styles.stack}>
          <InfoCard title="Probabilidad de voz humana" accent={colors.green}>
            <StatBar label="Humana" value={Number(result.human_probability || 0)} accent={colors.green} />
          </InfoCard>

          <InfoCard title="Probabilidad de voz generada por IA" accent={colors.red}>
            <StatBar label="IA" value={Number(result.ai_probability || 0)} accent={colors.red} />
          </InfoCard>
        </View>

        <InfoCard
          title="Recomendaciones de seguridad"
          subtitle="Siguientes pasos sugeridos según el nivel de riesgo detectado."
          accent={riskAccent[riskLevel] || colors.yellow}
        >
          <View style={styles.list}>
            {recommendations.map((item) => (
              <View key={item} style={styles.recommendationRow}>
                <View style={[styles.bullet, { backgroundColor: riskAccent[riskLevel] || colors.yellow }]} />
                <Text style={styles.recommendationText}>{item}</Text>
              </View>
            ))}
          </View>
        </InfoCard>

        <PrimaryButton label="Analizar otro audio" onPress={() => navigation.popToTop()} />
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
  disclaimer: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  stack: {
    gap: spacing.md,
  },
  list: {
    gap: 12,
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    flexShrink: 0,
  },
  recommendationText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
