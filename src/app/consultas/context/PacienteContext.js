"use client";
import { createContext, useContext, useState } from "react";

// Crear el contexto
const PacienteContext = createContext();

// Proveedor del contexto
export function PacienteProvider({ children }) {
  // Información básica del paciente
  const [pacienteData, setPacienteData] = useState({
    noBoleta: null,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    telefono: "",
    edad: "",
    sexo: "",
    // Puedes añadir más datos aquí si es necesario
  });

  // Función para actualizar la información básica del paciente
  const setPacienteInfo = (info) => {
    setPacienteData(info);
  };

  // Datos de la consulta acumulados
  const [consultaData, setConsultaData] = useState({
    estiloDeVida: {},
    trastornos: {},
    mediciones: {},
    kilocalorias: {},
    recordatorio24Hrs:{},
    // Añadir más secciones según sea necesario
  });
  
  const updateConsultaData = (field, value) => {
    setConsultaData((prevData) => {
        const updatedData = { ...prevData, [field]: value };
        console.log("Datos de la consulta actualizados:", updatedData); // Revisa los datos aquí
        return updatedData;
    });
};

const resetConsultaData = () => {
  setConsultaData({
    estiloDeVida: {},
    trastornos: {},
    mediciones: {},
    kilocalorias: {},
    recordatorio24Hrs: {},
  });
};
  
  const guardarConsulta = async () => {
    const consulta = {
      // noBoleta: "2019988777", // Usa el ID de prueba o el real desde el contexto
      noBoleta: pacienteData.noBoleta,
      actLaboralData: consultaData.estiloDeVida.actividadLaboral,
      actFisicaData: consultaData.estiloDeVida.actividadFisica,
      toxicomaniasData: consultaData.estiloDeVida.toxicomanias,
      habitosDietData: consultaData.estiloDeVida.habitosDieteticos,
      transGastroData: consultaData.trastornos.formattedTrastornos,
      ginecoObstreData: consultaData.trastornos.ginecoObstetricos,
      plieguesData: consultaData.mediciones.pliegues,
      perimetrosData: consultaData.mediciones.perimetros,
      diametrosData: consultaData.mediciones.diametros,
      bioimpedanciaData: consultaData.mediciones.bioimpedancia,
      bioquimicosData: consultaData.mediciones.indicadores,
      recordatorioData: consultaData.recordatorio24Hrs,
      kilocaloriasData: consultaData.kilocalorias,
    };
  
    // Agregar console.log para verificar el contenido de cada parte
    console.log("noBoleta:", consulta.noBoleta);
    console.log("actLaboralData:", consulta.actLaboralData);
    console.log("actFisicaData:", consulta.actFisicaData);
    console.log("toxicomaniasData:", consulta.toxicomaniasData);
    console.log("habitosDietData:", consulta.habitosDietData);
    console.log("transGastroData:", consulta.transGastroData);
    console.log("ginecoObstreData:", consulta.ginecoObstreData);
    console.log("plieguesData:", consulta.plieguesData);
    console.log("perimetroData:", consulta.perimetrosData);
    console.log("diametrosData:", consulta.diametrosData);
    console.log("bioimopedanciaData:", consulta.bioimpedanciaData);
    console.log("bioquimicosData:", consulta.bioimpedanciaData);
    console.log("bioquimicosData:", consulta.recordatorioData);

    // Log completo del objeto consulta
    console.log("Consulta completa:", consulta);

    try {
      const response = await fetch("/api/consulta/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(consulta)
      });
  
      if (response.ok) {
        console.log("Consulta registrada exitosamente");
      } else {
        const errorData = await response.json();
        console.error("Error al registrar consulta:", errorData.error);
      }
    } catch (error) {
      console.error("Error al registrar consulta:", error);
    }
  };  

  return (
    <PacienteContext.Provider
      value={{
        ...pacienteData,
        setPacienteInfo,
        consultaData,
        updateConsultaData,
        resetConsultaData,
        guardarConsulta,
      }}
    >
      {children}
    </PacienteContext.Provider>
  );
}

// Hook para usar el contexto del paciente
export function usePaciente() {
  return useContext(PacienteContext);
}
