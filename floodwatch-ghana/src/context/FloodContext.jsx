import { useState } from "react";
import { FloodContext } from "./FloodContextContext";

export default function FloodProvider({ children }) {
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [weatherData, setWeatherData] = useState(null);
  const [reports, setReports] = useState([]);
  const [smsAlerts, setSmsAlerts] = useState([]);

  return (
    <FloodContext.Provider
      value={{
        riskLevel,
        setRiskLevel,
        weatherData,
        setWeatherData,
        reports,
        setReports,
        smsAlerts,
        setSmsAlerts,
      }}
    >
      {children}
    </FloodContext.Provider>
  );
}