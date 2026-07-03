import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";
import { mockAudioFile } from "../mockData";

export default function NewAnalysisScreen({ onAnalyze }) {
  const [sender, setSender] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nuevo análisis</Text>
        <Ionicons name="notifications-outline" size={20} color={colors.text} />
      </View>

      <Text style={styles.helperTop}>
        Importa un audio recibido por WhatsApp para detectar posibles señales
        de manipulación.
      </Text>

      <View style={styles.audioCard}>
        <View style={styles.audioRow}>
          <View style={styles.audioIcon}>
            <Ionicons name="document-text" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.audioName}>{mockAudioFile.name}</Text>
            <Text style={styles.audioMeta}>
              {mockAudioFile.duration} · {mockAudioFile.size}
            </Text>
          </View>
        </View>

        <View style={styles.waveform}>
          {Array.from({ length: 28 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                { height: 6 + Math.abs(Math.sin(i * 0.8)) * 22 },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.changeAudioButton}>
          <Ionicons name="swap-horizontal" size={16} color={colors.text} />
          <Text style={styles.changeAudioText}>Cambiar audio</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>¿Quién envió este audio?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Mamá"
        placeholderTextColor={colors.textFaint}
        value={sender}
        onChangeText={setSender}
      />
      <Text style={styles.helperText}>
        Nos ayuda a identificar el efecto del análisis en el resultado.
      </Text>

      <TouchableOpacity style={styles.analyzeButton} onPress={onAnalyze}>
        <Ionicons name="scan" size={18} color="#fff" />
        <Text style={styles.analyzeButtonText}>Analizar audio</Text>
      </TouchableOpacity>

      <View style={styles.privacyRow}>
        <Ionicons name="lock-closed" size={12} color={colors.textFaint} />
        <Text style={styles.privacyText}>
          Tu audio será tratado automáticamente y analizado para identificar
          posibles técnicas de manipulación conversacional.
        </Text>
      </View>

      <View style={styles.tabBar}>
        <TabItem icon="grid-outline" label="Dashboard" />
        <TabItem icon="mic-outline" label="Grabar" />
        <TabItem icon="scan" label="Scan" active />
        <TabItem icon="person-outline" label="Perfil" />
      </View>
    </SafeAreaView>
  );
}

function TabItem({ icon, label, active }) {
  return (
    <View style={styles.tabItem}>
      <View style={active ? styles.tabIconActive : null}>
        <Ionicons
          name={icon}
          size={20}
          color={active ? "#fff" : colors.textMuted}
        />
      </View>
      <Text
        style={[styles.tabLabel, active && { color: colors.text }]}
      >
        {label}
      </Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  helperTop: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  audioCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  audioIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  audioName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  audioMeta: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 2,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 32,
    marginVertical: spacing.sm,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  changeAudioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: spacing.sm,
  },
  changeAudioText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  helperText: {
    color: colors.textFaint,
    fontSize: 11,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  analyzeButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  privacyRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: spacing.md,
    paddingRight: spacing.md,
  },
  privacyText: {
    flex: 1,
    color: colors.textFaint,
    fontSize: 11,
    lineHeight: 15,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    marginTop: "auto",
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  tabIconActive: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  tabLabel: {
    color: colors.textFaint,
    fontSize: 10,
  },
});
