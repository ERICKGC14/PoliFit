"use client";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaciente } from "../../context/PacienteContext";
import { Spinner } from "@nextui-org/react"; // Puedes usar cualquier spinner o loader que prefieras
//import Cronometro from "../../components/Cronometro";

function Recordatorio24Hrs() {
  const { control, handleSubmit, reset, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading
  const router = useRouter();
  const { consultaData, updateConsultaData, guardarConsulta } = usePaciente();

  const meals = [
    { name: "DESAYUNO" },
    { name: "COLACIÓN 1" },
    { name: "COMIDA" },
    { name: "COLACIÓN 2" },
    { name: "CENA" },
  ];

  useEffect(() => {
    if (consultaData.recordatorio24Hrs) {
      reset(consultaData.recordatorio24Hrs);
    }
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 1500); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, [consultaData.recordatorio24Hrs, reset]);

  const handleGuardar = () => {
    const currentData = getValues(); // Obtener los datos actuales del formulario
    updateConsultaData("recordatorio24Hrs", currentData);
  };

  const handleAnterior = () => {
    setIsLoading(true);
    handleGuardar();
    router.push("/consultas/formularios/trastornos");
  };

  const handleSiguiente = () => {
    setIsLoading(true);
    handleGuardar();
    router.push("/consultas/formularios/mediciones");
  };
  // Verifica si está cargando y muestra el spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" color="primary" /> {/* Spinner de NextUI */}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Recordatorio 24 hrs.</h2>

      <form onSubmit={handleSubmit(handleGuardar)}>
        {meals.map((meal, index) => (
          <MealSection key={index} meal={meal} control={control} />
        ))}

        {/* Botones de Navegación */}
        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={handleAnterior}
          >
            Anterior
          </button>
          <button
            className="bg-[#11404E] text-white py-2 px-4 rounded-md"
            onClick={handleSiguiente}
          >
            Siguiente
          </button>
        </div>

      </form>
    </div>
  );
}

function MealSection({ meal, control }) {
  const isColacion = meal.name.includes("COLACIÓN");

  return (
    <div
      style={{ backgroundColor: isColacion ? "#11404E" : "white" }}
      className="shadow-md p-6 rounded-md mb-6"
    >
      <h3
        className={`text-xl font-semibold text-center mb-4 ${
          isColacion ? "text-white" : ""
        }`}
      >
        {meal.name}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name={`${meal.name.toLowerCase().replace(" ", "_")}_hora`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <label
                className={`block font-medium mb-1 ${
                  isColacion ? "text-white" : ""
                }`}
              >
                Hora:
              </label>
              <input
                type="time"
                {...field}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
        />
        <Controller
          name={`${meal.name.toLowerCase().replace(" ", "_")}_lugar`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <label
                className={`block font-medium mb-1 ${
                  isColacion ? "text-white" : ""
                }`}
              >
                Lugar:
              </label>
              <input
                type="text"
                {...field}
                className="w-full p-2 border rounded-md"
                placeholder="Escuela"
              />
            </div>
          )}
        />
        <Controller
          name={`${meal.name.toLowerCase().replace(" ", "_")}_descripcion`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="col-span-2">
              <label
                className={`block font-medium mb-1 ${
                  isColacion ? "text-white" : ""
                }`}
              >
                Descripción alimentos:
              </label>
              <input
                type="text"
                {...field}
                className="w-full p-2 border rounded-md"
                placeholder="Descripción alimentos"
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default Recordatorio24Hrs;
