// consulta/fromularios/trastornos
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePaciente } from "../../context/PacienteContext";
import { Spinner } from "@nextui-org/react"; // Puedes usar cualquier spinner o loader que prefieras
//import Cronometro from "../../components/Cronometro";

function Trastornos() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading

  const { consultaData, updateConsultaData } = usePaciente();
  const trastornosOptions = [
    "vomito",
    "diarrea",
    "estreni",
    "colitis",
    "gastri",
    "nauseas",
    "reflujo",
    "disfagia",
    "flatulen",
    "disten",
    "pirosis",
  ];

  const [trastornos, setTrastornos] = useState({});
  const [ginecoObstetricos, setGinecoObstetricos] = useState({
    G: "",
    P: "",
    C: "",
    FUM: "",
    "FUP/C": "",
    SDGI: "",
    PPG: "",
    Anticonceptivos: "",
    notas: "",
  });

  useEffect(() => {
    if (consultaData.trastornos) {
      setTrastornos(consultaData.trastornos.trastornos || {});
    }
    if (consultaData.ginecoObstetricos) {
      setGinecoObstetricos(consultaData.ginecoObstetricos || {
        G: "",
        P: "",
        C: "",
        FUM: "",
        "FUP/C": "",
        SDGI: "",
        PPG: "",
        Anticonceptivos: "",
        notas: "",
      });
    }
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 1500); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, [consultaData]);

  const handleTrastornoChange = (event, name) => {
    const { checked } = event.target;
    setTrastornos((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: checked,
        frecuencia: checked ? prev[name]?.frecuencia || "" : "",
      },
    }));
  };

  const handleFrecuenciaChange = (event, name) => {
    const { value } = event.target;
    setTrastornos((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        frecuencia: value,
      },
    }));
  };

  const handleGinecoObstetricosChange = (event) => {
    const { name, value } = event.target;
    setGinecoObstetricos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = () => {
    setIsLoading(true);
    // Convertir cada trastorno en un string de frecuencia o vacío según corresponda
    const formattedTrastornos = Object.keys(trastornos).reduce((acc, key) => {
      acc[key] = trastornos[key].value ? trastornos[key].frecuencia : "";
      return acc;
    }, {});
  
    // Combinar `formattedTrastornos` con `ginecoObstetricos` en un solo objeto
    const datosTrastornos = {
      formattedTrastornos,
      ginecoObstetricos,
    };
  
    console.log("datos recolectados de trastornos 1: ", formattedTrastornos);
    console.log("datos recolectados de trastornos 2: ", ginecoObstetricos);
    console.log("datos recolectados de trastornos 3: ", datosTrastornos);
    console.log("datos recolectados de trastornos 4: ", datosTrastornos.formattedTrastornos);
    // Enviar el objeto completo como un solo `updateConsultaData`
    updateConsultaData("trastornos", datosTrastornos);
    router.push("/consultas/formularios/recordatorio24hrs");
  };  

  const labels = {
    vomito: "Vómito",
    diarrea: "Diarrea",
    estreni: "Estreñimiento",
    colitis: "Colitis",
    gastri: "Gastritis",
    nauseas: "Náuseas",
    reflujo: "Reflujo",
    disfagia: "Disfagia",
    flatulen: "Flatulencias",
    disten: "Distensión",
    pirosis: "Pirosis",
    G: "Gestaciones",
    P: "Partos",
    C: "Cesáreas",
    FUM: "Fecha Última Menstruación",
    "FUP/C": "Fecha Último Parto/Cesárea",
    SDGI: "Síndrome de Dolor Genitourinario",
    PPG: "Planificación Familiar",
    Anticonceptivos: "Uso de Anticonceptivos",
    notas: "Notas",
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
      <h2 className="text-2xl font-semibold mb-4">Trastornos</h2>

      {/* Trastornos Gastrointestinales */}
      <div className="bg-white shadow-md p-6 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Trastornos Gastrointestinales</h3>
        <div className="grid grid-cols-3 gap-4">
          {trastornosOptions.map((item) => (
            <div key={item}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  className="mr-2"
                  checked={!!trastornos[item]?.value}
                  onChange={(e) => handleTrastornoChange(e, item)}
                />
                <label htmlFor={item}>{labels[item] || item}</label>
              </div>
              <select
                className="w-full p-2 border rounded-md mt-2"
                disabled={!trastornos[item]?.value}
                value={trastornos[item]?.frecuencia || ""}
                onChange={(e) => handleFrecuenciaChange(e, item)}
              >
                <option value="" disabled hidden>Frecuencia</option>
                <option value="Rara vez">Rara vez</option>
                <option value="Ocasionalmente">Ocasionalmente</option>
                <option value="Frecuentemente">Frecuentemente</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      {/* Gineco-Obstétricos */}
      <div className="grid grid-cols-2 gap-6">
        <div className="shadow-md p-6 rounded-md" style={{ backgroundColor: "#11404E" }}>
          <h3 className="text-xl text-center font-semibold mb-4 text-white">
            Gineco-Obstétricos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Campos de texto existentes */}
            {["G", "P", "C", "SDGI"].map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1 text-white">{labels[field] || field}</label>
                <input
                  type="text"
                  name={field}
                  value={ginecoObstetricos[field]}
                  onChange={handleGinecoObstetricosChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}

            {/* Campo "Fecha Última Menstruación" (FUM) */}
            <div>
              <label className="block font-medium mb-1 text-white">
                {labels.FUM || "Fecha Última Menstruación"}
              </label>
              <input
                type="date"
                name="FUM"
                value={ginecoObstetricos.FUM}
                onChange={handleGinecoObstetricosChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Campo "Fecha Último Parto/Cesárea" (FUP/C) */}
            <div>
              <label className="block font-medium mb-1 text-white">
                {labels["FUP/C"] || "Fecha Último Parto/Cesárea"}
              </label>
              <input
                type="date"
                name="FUP/C"
                value={ginecoObstetricos["FUP/C"]}
                onChange={handleGinecoObstetricosChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Campo "Planificación Familiar" (PPG) */}
            <div>
              <label className="block font-medium mb-1 text-white">
                {labels.PPG || "Planificación Familiar"}
              </label>
              <input
                type="checkbox"
                name="PPG"
                checked={ginecoObstetricos.PPG === "true"}
                onChange={(e) =>
                  setGinecoObstetricos({
                    ...ginecoObstetricos,
                    PPG: e.target.checked ? "true" : "false",
                  })
                }
                className="w-5 h-5 border rounded-md"
              />
            </div>

            {/* Campo "Uso de Anticonceptivos" (Anticonceptivos) */}
            <div>
              <label className="block font-medium mb-1 text-white">
                {labels.Anticonceptivos || "Uso de Anticonceptivos"}
              </label>
              <select
                name="Anticonceptivos"
                value={ginecoObstetricos.Anticonceptivos}
                onChange={handleGinecoObstetricosChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="" disabled hidden>Seleccione...</option>
                <option value="Píldora">Píldora</option>
                <option value="DIU">DIU</option>
                <option value="Condón">Condón</option>
                <option value="Implante">Implante</option>
                <option value="Inyección">Inyección</option>
                <option value="Anillo Vaginal">Anillo Vaginal</option>
                <option value="Parche">Parche</option>
              </select>
            </div>

            {/* Campo "Notas" */}
            <div className="col-span-2">
              <label className="block font-medium mb-1 text-white">{labels.notas || "Notas"}</label>
              <textarea
                name="notas"
                value={ginecoObstetricos.notas}
                onChange={handleGinecoObstetricosChange}
                className="w-full p-2 border rounded-md"
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Botones de Navegación */}
      <div className="flex justify-between mt-8">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => {
            handleGuardar();
            router.push("/consultas/formularios/estilovida")}}
        >
          Anterior
        </button>
        <button
          className="bg-[#11404E] text-white py-2 px-4 rounded-md"
          onClick={handleGuardar}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Trastornos;
