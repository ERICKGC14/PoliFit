// CronometroContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CronometroContext = createContext();

export function useCronometro() {
  return useContext(CronometroContext);
}

export function CronometroProvider({ children }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const value = {
    seconds,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  };

  return (
    <CronometroContext.Provider value={value}>
      {children}
    </CronometroContext.Provider>
  );
}


