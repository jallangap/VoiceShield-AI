import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "./screens/WelcomeScreen";
import NewAnalysisScreen from "./screens/NewAnalysisScreen";
import ReportScreen from "./screens/ReportScreen";
import { mockUser } from "./mockData";

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | newAnalysis | report
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = () => {
    setCurrentUser(mockUser);
    setScreen("newAnalysis");
  };

  const handleAnalyze = () => {
    setScreen("report");
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === "welcome" && <WelcomeScreen onLogin={handleLogin} />}
      {screen === "newAnalysis" && (
        <NewAnalysisScreen onAnalyze={handleAnalyze} />
      )}
      {screen === "report" && (
        <ReportScreen
          onAnalyzeAnother={() => setScreen("newAnalysis")}
          onBack={() => setScreen("newAnalysis")}
        />
      )}
    </>
  );
}
