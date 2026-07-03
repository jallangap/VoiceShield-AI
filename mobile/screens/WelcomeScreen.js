import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";

export default function WelcomeScreen({ onLogin }) {

  // Se simula ingreso y luego vamos a integrarnos con Clerk
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="shield-checkmark" size={20} color={colors.text} />
        <Text style={styles.headerTitle}>Guardian AI</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCircle}>
          <Ionicons name="shield-checkmark" size={64} color={colors.purple} />
        </View>
      </View>

      <Text style={styles.title}>Guardian AI</Text>
      <Text style={styles.subtitle}>
        No analiza quién habla, analiza cómo intentan influenciarte.
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onLogin}>
          <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogin}>
          <Text style={styles.linkText}>Continuar como invitado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Protegemos tu privacidad. Tu audio solo se utiliza para el análisis.
      </Text>
      <View style={styles.footerLinks}>
        <Text style={styles.footerLink}>Privacidad</Text>
        <Text style={styles.footerDot}>·</Text>
        <Text style={styles.footerLink}>Términos</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    marginTop: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  hero: {
    marginTop: spacing.xl * 1.5,
    marginBottom: spacing.lg,
  },
  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: "#1A1F3A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
  },
  footerText: {
    color: colors.textFaint,
    fontSize: 11,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  footerLinks: {
    flexDirection: "row",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: 6,
  },
  footerLink: {
    color: colors.textFaint,
    fontSize: 11,
    textDecorationLine: "underline",
  },
  footerDot: {
    color: colors.textFaint,
    fontSize: 11,
  },
});
