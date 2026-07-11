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

      <TouchableOpacity
        style={styles.item}
        onPress={() => setCurrentScreen("MAIN")}
      >
        <Ionicons
          name={currentScreen === "MAIN" ? "home" : "home-outline"}
          size={24}
          color={currentScreen === "MAIN" ? "#D62828" : "#999"}
        />
        <Text
          style={[
            styles.text,
            currentScreen === "MAIN" && styles.activeText,
          ]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => setCurrentScreen("DETAILS")}
      >
        <Ionicons
          name={currentScreen === "DETAILS" ? "document-text" : "document-text-outline"}
          size={24}
          color={currentScreen === "DETAILS" ? "#D62828" : "#999"}
        />
        <Text
          style={[
            styles.text,
            currentScreen === "DETAILS" && styles.activeText,
          ]}
        >
          Informe
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#999"
        />
        <Text style={styles.text}>
          Salir
        </Text>
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

    height: 72,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#171717",

    borderRadius: 22,

    borderWidth: 1,
    borderColor: "#2B2B2B",

    elevation: 12,
  },

  item: {
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    marginTop: 5,
    fontSize: 11,
    color: "#999",
  },

  activeText: {
    color: "#D62828",
    fontWeight: "700",
  },
});