"use client";
import { usePaciente } from "../context/PacienteContext";
import MenuConsultas from "../components/MenuConsultas";
import Cronometro from "../components/Cronometro";

export default function FormulariosLayout({ children }) {
    const { noBoleta, nombre, email, telefono, apellidoPaterno, apellidoMaterno } = usePaciente();
  
    return (
      <div>
        <MenuConsultas />
        <Cronometro />
        {/* Información del paciente */}
        <div className="bg-white shadow-md p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Información del Paciente</h2>
          <p><strong>Nombre:</strong> {nombre + " " + apellidoPaterno + " " + apellidoMaterno}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Teléfono:</strong> {telefono}</p>
        </div>
        <div className="p-4">
          <h1 className="text-4xl font-bold mb-6">Nueva Consulta</h1>
          {children} {/* Renderiza el contenido de la subpágina seleccionada */}
        </div>
      </div>
    );
  }