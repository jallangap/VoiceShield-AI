import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNavigation({
  currentScreen,
  setCurrentScreen,
  handleLogout,
}) {
  return (
    <View style={styles.container}>
      {/* 1. INICIO */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => setCurrentScreen("MAIN")}
      >
        <Ionicons
          name={currentScreen === "MAIN" ? "home" : "home-outline"}
          size={22}
          color={currentScreen === "MAIN" ? "#D62828" : "#999"}
        />
        <Text style={[styles.text, currentScreen === "MAIN" && styles.activeText]}>
          Inicio
        </Text>
      </TouchableOpacity>

      {/* 2. INFORME */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => setCurrentScreen("DETAILS")}
      >
        <Ionicons
          name={currentScreen === "DETAILS" ? "document-text" : "document-text-outline"}
          size={22}
          color={currentScreen === "DETAILS" ? "#D62828" : "#999"}
        />
        <Text style={[styles.text, currentScreen === "DETAILS" && styles.activeText]}>
          Informe
        </Text>
      </TouchableOpacity>

      {/* 3. AUDIOS (Tu Módulo Reubicado en Tercera Posición) */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => setCurrentScreen("WSP_ANALYSIS")}
      >
        <Ionicons
          name={currentScreen === "WSP_ANALYSIS" ? "shield-checkmark" : "shield-checkmark-outline"}
          size={22}
          color={currentScreen === "WSP_ANALYSIS" ? "#D62828" : "#999"}
        />
        <Text style={[styles.text, currentScreen === "WSP_ANALYSIS" && styles.activeText]}>
          Audios
        </Text>
      </TouchableOpacity>

      {/* 4. SALIR */}
      <TouchableOpacity
        style={styles.item}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={22} color="#999" />
        <Text style={styles.text}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 68,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#171717",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2B2B2B",
    elevation: 12,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    marginTop: 4,
    fontSize: 10,
    color: "#999",
    fontFamily: 'Sora_400Regular',
  },
  activeText: {
    color: "#D62828",
    fontWeight: "700",
  },
});