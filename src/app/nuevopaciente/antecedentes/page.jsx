"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePacienteRegistro } from "../context/PacienteRegistroContext";
import { Spinner } from "@nextui-org/react";

function Antecedentes() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { guardarRegistroPaciente, pacienteData, updatePacienteData } =
    usePacienteRegistro();
  // Verificar el contexto
  console.log("Contexto pacienteData en Antecedentes:", pacienteData);

  const [selectedFamilyHistory, setSelectedFamilyHistory] = useState(
    pacienteData.antecedentes?.selectedFamilyHistory || {}
  );
  const [selectedPersonalHistory, setSelectedPersonalHistory] = useState(
    pacienteData.antecedentes?.selectedPersonalHistory || {}
  );

  useEffect(() => {
    if (pacienteData.antecedentes) {
      setSelectedFamilyHistory(
        pacienteData.antecedentes.selectedFamilyHistory || {}
      );
      setSelectedPersonalHistory(
        pacienteData.antecedentes.selectedPersonalHistory || {}
      );
    }
    setIsLoading(false);
  }, [pacienteData.antecedentes]);

  const handleFamilyHistoryChange = (event) => {
    const { name, checked } = event.target;
    setSelectedFamilyHistory((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePersonalHistoryChange = (event) => {
    const { name, checked } = event.target;
    setSelectedPersonalHistory((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleGuardarAntecedentes = () => {
    updatePacienteData("antecedentes", {
      selectedFamilyHistory,
      selectedPersonalHistory,
    });
    alert("Datos guardados correctamente.");
  };

  const handleRegistrarPaciente = async () => {
    setIsLoading(true);
    const exito = await guardarRegistroPaciente();
  
    if (exito) {
      //alert("Registro exitoso.");
      router.push("/consultas");
    } else {
      setIsLoading(false);
      console.warn("El registro del paciente falló. No se redirigirá.");
    }
  };

  // const handleRegistrarPaciente = async () => {
  //   await guardarRegistroPaciente(); // Llama a la función para guardar la consulta en el backend
  //   alert("Registro de Paciente finalizada con éxito.");
  //   router.push("/consultas");
  // };
  

  const familyHistoryFields = [
    { label: "Alergías", name: "alerg" },
    { label: "Cardiológicos", name: "cardiologicos" },
    { label: "Diabétes", name: "diabetes" },
    { label: "Cáncer", name: "cancer" },
    { label: "Obesidad", name: "obesidad" },
    { label: "Renales", name: "renales" },
    { label: "Hipertension", name: "hipertension" },
    { label: "Anemia", name: "anemia" },
    { label: "Desordenes alimenticios", name: "desordenes_aux" },
    { label: "Hepatobiliares", name: "hepatobiliares" },
    { label: "Dislipidimias", name: "dislipidimias" },
    { label: "Otros", name: "otros" },
  ];

  const personalHistoryFields = [
    { label: "Alergías", name: "alergias" },
    { label: "Cardiológicos", name: "cardiologicos" },
    { label: "Diabétes", name: "diabetes" },
    { label: "Cáncer", name: "cancer" },
    { label: "Cirugías/Fracturas", name: "cirugias" },
    { label: "Obesidad", name: "obesidad" },
    { label: "Renales", name: "renales" },
    { label: "Hipertension", name: "hipertension" },
    { label: "Anemia", name: "anemia" },
    { label: "Tiroides", name: "tiroides" },
    { label: "Desordenes ax.", name: "desordenes_aux" },
    { label: "Hepatobiliares", name: "hepatobiliares" },
    { label: "Dislipidimias", name: "dislipidimias" },
    { label: "Hepatitis", name: "hepatitis" },
    { label: "Otros", name: "otros" },
  ];
  // Verifica si está cargando y muestra el spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" color="primary" /> {/* Spinner de NextUI */}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
        Nuevo Paciente
      </h1>
      <h2 className="text-2xl font-semibold mb-4">Antecedentes</h2>

      {/* Antecedentes Heredofamiliares */}
      <div className="bg-white shadow-md p-4 md:p-6 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Antecedentes Heredofamiliares
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {familyHistoryFields.map(({ label, name }) => (
            <div key={name}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={name}
                  name={name}
                  className="mr-2"
                  checked={!!selectedFamilyHistory[name]}
                  onChange={handleFamilyHistoryChange}
                />
                <label htmlFor={name}>{label}</label>
              </div>
              {selectedFamilyHistory[name] && (
                <input
                  type="text"
                  placeholder="Parentesco"
                  value={selectedFamilyHistory[name]?.parentesco || ""}
                  onChange={(e) => {
                    setSelectedFamilyHistory((prev) => ({
                      ...prev,
                      [name]: { ...prev[name], parentesco: e.target.value },
                    }));
                  }}
                  className="w-full md:w-3/4 lg:w-1/2 p-2 border rounded-md mt-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Antecedentes Personales Patológicos */}
      <div
        className="shadow-md p-4 md:p-6 rounded-md"
        style={{ backgroundColor: "#11404E" }}
      >
        <h3 className="text-xl font-semibold mb-4 text-white">
          Antecedentes Personales Patológicos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {personalHistoryFields.map(({ label, name }) => (
            <div key={name} className="flex items-center">
              <input
                type="checkbox"
                id={name}
                name={name}
                className="mr-2"
                checked={!!selectedPersonalHistory[name]}
                onChange={handlePersonalHistoryChange}
              />
              <label className="text-white" htmlFor={name}>
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-between mt-8">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => {
            handleGuardarAntecedentes();
            router.push("../../nuevopaciente");
          }}
        >
          Anterior
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={handleGuardarAntecedentes}
        >
          Guardar
        </button>
        {/* <button
          className="bg-[#11404E] text-white py-2 px-4 rounded-md"
          onClick={() => {
            handleRegistrarPaciente();
          }}
        >
          Registrar Paciente
        </button> */}
        <button className="bg-[#11404E] text-white py-2 px-4 rounded-md flex justify-center items-center" onClick={() => {handleRegistrarPaciente();}}>
          Regitrar paciente
        </button>
      </div>
    </div>
  );
}

export default Antecedentes;
