import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";
import { mockAnalysisResult } from "../mockData";

export default function ReportScreen({ onAnalyzeAnother, onBack }) {
  const r = mockAnalysisResult;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reporte de análisis</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resultado principal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultado del análisis</Text>

          <View style={styles.riskCircleWrap}>
            <View style={styles.riskCircle}>
              <Text style={styles.riskPercent}>{r.riskPercent}%</Text>
              <Text style={styles.riskLabel}>{r.riskLabel}</Text>
            </View>
          </View>

          <Text style={styles.riskDescription}>
            Este mensaje presenta varias señales asociadas con manipulación
            mediante ingeniería social.
          </Text>
        </View>

        {/* Resumen */}
        <View style={styles.card}>
          <SectionTitle icon="document-text-outline" label="Resumen" />
          <Text style={styles.bodyText}>{r.summary}</Text>
        </View>

        {/* Técnicas detectadas */}
        <View style={styles.card}>
          <SectionTitle icon="alert-circle-outline" label="Técnicas detectadas" />
          <View style={styles.chipsWrap}>
            {r.techniques.map((t) => (
              <View
                key={t.label}
                style={[
                  styles.chip,
                  {
                    borderColor:
                      t.tone === "danger" ? colors.danger : colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: t.tone === "danger" ? colors.danger : colors.primary,
                    },
                  ]}
                >
                  {t.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Frases relevantes */}
        <View style={styles.card}>
          <SectionTitle icon="chatbubble-ellipses-outline" label="Frases relevantes" />
          {r.relevantPhrases.map((phrase) => (
            <View key={phrase} style={styles.phraseRow}>
              <Text style={styles.phraseQuote}>“{phrase}”</Text>
            </View>
          ))}
        </View>

        {/* Recomendación */}
        <View style={[styles.card, styles.recommendationCard]}>
          <SectionTitle icon="shield-checkmark-outline" label="Recomendación" />
          <Text style={styles.bodyText}>{r.recommendation}</Text>
        </View>

        <Text style={styles.aiNote}>
          ⓘ Análisis generado mediante inteligencia artificial
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onAnalyzeAnother}>
          <Text style={styles.primaryButtonText}>+ Analizar otro audio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="share-outline" size={16} color={colors.text} />
          <Text style={styles.secondaryButtonText}>Compartir reporte</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, label }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.sectionTitleText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  riskCircleWrap: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  riskCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerBg,
  },
  riskPercent: {
    color: colors.danger,
    fontSize: 26,
    fontWeight: "800",
  },
  riskLabel: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  riskDescription: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.sm,
  },
  sectionTitleText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  bodyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  phraseRow: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  phraseQuote: {
    color: colors.text,
    fontSize: 13,
    fontStyle: "italic",
  },
  recommendationCard: {
    borderColor: colors.primary,
  },
  aiNote: {
    color: colors.textFaint,
    fontSize: 11,
    textAlign: "center",
    marginVertical: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
});
