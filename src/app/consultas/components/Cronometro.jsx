import React from "react";
import { useCronometro } from "../context/CronometroContext";

function Cronometro() {
  const { formatTime, startTimer, stopTimer, resetTimer, isRunning } = useCronometro();

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#f0f0f0",
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        textAlign: "center",
      }}
    >
      <p className="font-bold">Tiempo transcurrido: {formatTime()}</p>
      {!isRunning ? (
        <button
          onClick={startTimer}
          //className="mr-2 p-2 bg-green-500 text-white rounded"
          className= "mr-2 bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40]"
        >
          Iniciar Cronómetro
        </button>
      ) : (
        <button
          onClick={stopTimer}
          className="mr-2 p-2 bg-red-500 text-white rounded"
        >
          Detener Cronómetro
        </button>
      )}
      <button
        onClick={resetTimer}
        className="mr-2 bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40]"
      >
        Reiniciar Cronómetro
      </button>
    </div>
  );
}

export default Cronometro;





