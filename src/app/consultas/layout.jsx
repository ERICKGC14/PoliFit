"use client";
import { PacienteProvider } from "./context/PacienteContext";
import { CronometroProvider } from "./context/CronometroContext";

export default function ConsultaLayout({ children }) {
  return (
    <div>
      <div className="p-4">
      <h1 className="text-4xl font-bold mb-6">Consultas</h1>
      <CronometroProvider>
      <PacienteProvider>
        {children}
      </PacienteProvider>
      </CronometroProvider>
      </div>
    </div>
  );
}