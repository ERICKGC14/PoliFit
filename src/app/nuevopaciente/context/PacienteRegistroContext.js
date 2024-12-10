"use client";
import { createContext, useContext, useState } from "react";

const PacienteRegistroContext = createContext();

export function PacienteRegistroProvider({ children }) {
  const [pacienteData, setPacienteData] = useState({
    datosPersonales: {},
    antecedentes: {},
  });

  const updatePacienteData = (section, data) => {
    setPacienteData((prevData) => {
      const updatedData = {
        ...prevData,
        [section]: { ...prevData[section], ...data },
      };
      console.log("Datos de paciente actualizados:", updatedData);
      return updatedData;
    });
  };

  const validarDatosPaciente = () => {
    const { datosPersonales } = pacienteData;

    if (!datosPersonales || !datosPersonales.noBoleta) {
      return { valido: false, mensaje: "El número de boleta es obligatorio." };
    }

    return { valido: true };
  };

  // Función para transformar SOLO antecedentes heredofamiliares
  const transformarAntecedentesHeredofamiliares = (antecedentes) => {
    if (!antecedentes || Object.keys(antecedentes).length === 0) {
      return null;
    }

    return Object.entries(antecedentes).reduce((acc, [key, value]) => {
      if (value && typeof value === "object" && value.parentesco) {
        acc[key] = value.parentesco; // Usar solo el parentesco si está definido
      }
      return acc;
    }, {});
  };

  // Función para limpiar los datos del paciente después de registrar
  const clearPacienteData = () => {
    setPacienteData({
      datosPersonales: {},
      antecedentes: {},
    });
  };
  const guardarRegistroPaciente = async () => {
    console.log("Datos del paciente a registrar:", pacienteData);
  
    const payload = {
      noBoleta: pacienteData.datosPersonales.noBoleta,
      pacienteData: pacienteData.datosPersonales,
      heredofamData: transformarAntecedentesHeredofamiliares(pacienteData.antecedentes.selectedFamilyHistory),
      perPatData: pacienteData.antecedentes.selectedPersonalHistory,
    };
  
    console.log("Payload enviado al backend:", payload);
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
  
    try {
      const response = await fetch("/api/pacientes/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      console.log("Estado de la respuesta:", response.status);
      console.log("Cuerpo de la respuesta:", data);
  
      if (response.ok) {
        console.log("Paciente registrado:", data);
        alert("Registro de paciente exitoso");
        clearPacienteData();
        return true; // Indica que el registro fue exitoso
      } else {
        alert("Error al registrar el paciente: " + (data.error || "Error desconocido"));
        return false; // Indica un error en el registro
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
      return false; // Indica que hubo un problema de conexión
    }
  };
  
  // const guardarRegistroPaciente = async () => {
  //   console.log("Datos del paciente a registrar:", pacienteData);

  //   const payload = {
  //     noBoleta: pacienteData.datosPersonales.noBoleta,
  //     pacienteData: pacienteData.datosPersonales,
  //     heredofamData: transformarAntecedentesHeredofamiliares(pacienteData.antecedentes.selectedFamilyHistory),
  //     perPatData: pacienteData.antecedentes.selectedPersonalHistory, // Se envía sin transformar
  //   };

  //   console.log("Payload enviado al backend:", payload);

  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     alert("No estás autenticado. Por favor, inicia sesión.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/pacientes/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log("Paciente registrado:", data);
  //       alert("Registro de paciente exitoso");
  //       clearPacienteData();
  //     } else {
  //       alert("Error al registrar: " + data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Error al conectar con el servidor");
  //   }
  // };

  return (
    <PacienteRegistroContext.Provider
      value={{
        pacienteData,
        updatePacienteData,
        guardarRegistroPaciente,
      }}
    >
      {children}
    </PacienteRegistroContext.Provider>
  );
}

export function usePacienteRegistro() {
  return useContext(PacienteRegistroContext);
}
