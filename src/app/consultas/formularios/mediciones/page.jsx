"use client";
import { usePaciente } from "../../context/PacienteContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/react";
//import Cronometro from "../../components/Cronometro";

function Mediciones() {
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading
  const { consultaData, updateConsultaData, noBoleta } = usePaciente();
  const [plieguesAnterior, setPlieguesAnterior] = useState({});
  const [perimetroData, setPerimetroData] = useState({});
  const [diametroData, setDiametroData] = useState({});
  const [bioimpedanciaData, setBioimpedanciaData] = useState({});
  const [bioquimicoData, setBioquimicoData] = useState({});
  const router = useRouter();

  // Local state for each section
  const [pliegues, setPliegues] = useState({});
  const [perimetros, setPerimetros] = useState({});
  const [diametros, setDiametros] = useState({});
  const [bioimpedancia, setBioimpedancia] = useState({});
  const [indicadores, setIndicadores] = useState({});

  // Función para realizar la consulta a la API
  const fetchPlieguesAnterior = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    try {
      // console.log("noBoleta en mediciones: ", noBoleta);
      const response = await fetch(`/api/consulta/getMediciones?noBoleta=${noBoleta}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        console.log('No se pudo obtener la última consulta');
      }
  
      const data = await response.json();
      console.log("Data recuperado de mediciones: ", data);
      console.log("Data recuperado de mediciones pliegue: ", data.Pliegue);

      // Recuperar los datos de Mediciones
      const plieguesData = data.Pliegue || [];  // Si no hay datos de pliegues, asignamos un arreglo vacío
      const diametrosData = data.Diametro || [];  // Lo mismo para Diametros
      setPlieguesAnterior(plieguesData); // Aquí se asume que `data` es un objeto con los campos de pliegues
      setDiametroData(data.Diametro || []);
      setPerimetroData(data.Perimetro || []);
      setBioimpedanciaData(data.Bioimpedancium || []);
      setBioquimicoData(data.Bioquimico || []);
      // Ahora puedes usar estas variables como desees, por ejemplo:
      console.log('Pliegues:', plieguesData);
      console.log('Diametros:', diametrosData);
    } catch (error) {
      console.log("Error al realizar la consulta de pliegues:", error);
      // console.error("Error al realizar la consulta de pliegues:", error);
    }
  };

  useEffect(() => {
    if (consultaData.mediciones) {
      setPliegues(consultaData.mediciones.pliegues || {});
      setPerimetros(consultaData.mediciones.perimetros || {});
      setDiametros(consultaData.mediciones.diametros || {});
      setBioimpedancia(consultaData.mediciones.bioimpedancia || {});
      setIndicadores(consultaData.mediciones.indicadores || {});
    }
    fetchPlieguesAnterior();
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 1500); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, [consultaData.mediciones]);

  // useEffect para ejecutar la consulta al montar el componente
  // useEffect(() => {
  //   fetchPlieguesAnterior();
  // }, []);

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     await fetchPlieguesAnterior();
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  const handleInputChange = (section, key, value) => {
    const updateFunc = {
      pliegues: setPliegues,
      perimetros: setPerimetros,
      diametros: setDiametros,
      bioimpedancia: setBioimpedancia,
      indicadores: setIndicadores,
    }[section];

    updateFunc((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSaveAndNext = () => {
    setIsLoading(true);
    const datosMediciones = {
      pliegues,
      perimetros,
      diametros,
      bioimpedancia,
      indicadores,
    };
    updateConsultaData("mediciones", datosMediciones);
    router.push("/consultas/formularios/kilocalorias");
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
      <h2 className="text-2xl font-semibold mb-4">Mediciones</h2>

      {/* Pliegues */}
      <div className="bg-white shadow-md p-6 rounded-md mb-6">
        <h3 className="text-xl text-center font-semibold mb-4">Pliegues</h3>
        <h4 className="text-lg font-semibold mb-2">Parámetros</h4>
          <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Subescapular (mm)", field: "subescapular" },
            { label: "Tríceps (mm)", field: "triceps" },
            { label: "Bíceps (mm)", field: "biceps" },
            { label: "Cresta Ilíaca (mm)", field: "cresta_iliaca" },
            { label: "Supraspinal (mm)", field: "supraespinal" },
            { label: "Abdominal (mm)", field: "abdominal" },
            { label: "Muslo Frontal (mm)", field: "muslo_frontal" },
            { label: "Pantorrilla Medial (mm)", field: "pantorrilla_medial" },
            { label: "Axilar Medial (mm)", field: "axilar_medial" },
            { label: "Pectoral (mm)", field: "pectoral" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={pliegues[field] || ""}
                onChange={(e) => handleInputChange("pliegues", field, e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {plieguesAnterior[field] || "No disponible"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Perímetros */}
      <div
        className="bg-white shadow-md p-6 rounded-md mb-6"
        style={{ backgroundColor: "#11404E" }}
      >
        <h3 className="text-xl text-center font-semibold mb-4 text-white">
          Perímetros
        </h3>
        <h4 className="text-lg font-semibold mb-2 text-white">Parámetros</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Cefálico (cm)", field: "cefalico" },
            { label: "Cuello (cm)", field: "cuello" },
            { label: "Mitad del brazo relajado (cm)", field: "mitad_bra_rela" },
            { label: "Mitad del brazo contraído (cm)", field: "mitad_bra_contra" },
            { label: "Antebrazo (cm)", field: "antebrazo" },
            { label: "Muñeca (cm)", field: "muñeca" },
            { label: "Mesosternal (cm)", field: "mesoesternal" },
            { label: "Umbilical (cm)", field: "umbilical" },
            { label: "Cintura (cm)", field: "cintura" },
            { label: "Cadera (cm)", field: "cadera" },
            { label: "Muslo 1 cm bajo la cresta ilíaca (cm)", field: "muslo" },
            { label: "Muslo medio (cm)", field: "muslo_medio" },
            { label: "Pantorrilla (cm)", field: "panto" },
            { label: "Tobillo (cm)", field: "tobillo" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block font-medium mb-1 text-white">{label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={perimetros[field] || ""}
                onChange={(e) => handleInputChange("perimetros", field, e.target.value)}
              />
              <p className="text-sm text-white mt-1">
                Medida anterior: {perimetroData[field] || "No disponible"}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* Diámetros */}
      <div className="bg-white shadow-md p-6 rounded-md mb-6">
        <h3 className="text-xl text-center font-semibold mb-4">Diámetros</h3>
        <h4 className="text-lg font-semibold mb-2">Parámetros</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Biacromial (cm)", field: "biacromial" },
            { label: "Biliocrestal (cm)", field: "biileocrestal" },
            { label: "Longitud del pie (cm)", field: "long_pie" },
            { label: "Transverso del tórax (cm)", field: "trans_torax" },
            { label: "Anteroposterior del tórax (cm)", field: "ante_torax" },
            { label: "Húmero (cm)", field: "humero" },
            { label: "Biestiloidea de la muñeca (cm)", field: "bies_muñeca" },
            { label: "Fémur (cm)", field: "femur" },
            { label: "Bimaleolar (cm)", field: "bimaleolar" },
            { label: "Transverso del pie (cm)", field: "trans_pie" },
            { label: "Longitud mano (cm)", field: "long_mano" },
            { label: "Transverso de la mano (cm)", field: "trans_mano" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={diametros[field] || ""}
                onChange={(e) => handleInputChange("diametros", field, e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {diametroData[field] || "No disponible"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bioimpedancia */}
      <div
        className="bg-white shadow-md p-6 rounded-md mb-6"
        style={{ backgroundColor: "#11404E" }}
      >
        <h3 className="text-xl text-center font-semibold mb-4 text-white">
          Bioimpedancia
        </h3>
        <h4 className="text-lg font-semibold mb-2 text-white">Parámetros</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Grasa total (%)", field: "grasa_total" },
            { label: "Grasa en sección superior (%)", field: "grasa_secsuper" },
            { label: "Grasa en sección inferior (%)", field: "grasa_secinfe" },
            { label: "Grasa visceral (%)", field: "grasa_visceral" },
            { label: "Edad Metabólica (años)", field: "edad_meta" },
            { label: "Masa libre de grasa (kg)", field: "masa_libregrasa" },
            { label: "Masa Muscular (kg)", field: "masa_muscular" },
            { label: "Peso óseo (kg)", field: "peso_oseo" },
            { label: "Agua Corporal (%)", field: "agua_corporal" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block font-medium mb-1 text-white">{label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={bioimpedancia[field] || ""}
                onChange={(e) => handleInputChange("bioimpedancia", field, e.target.value)}
              />
              <p className="text-sm text-white mt-1">
                Medición anterior: {bioimpedanciaData[field] || "No disponible"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores Bioquímicos */}
      <div className="bg-white shadow-md p-6 rounded-md">
        <h3 className="text-xl text-center font-semibold mb-4">
          Indicadores Bioquímicos
        </h3>
        <h4 className="text-lg font-semibold mb-2">Parámetros</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Hemoglobina (g/dL)", field: "homoglobina" },
            { label: "Glucosa (mg/dL)", field: "glucosa" },
            { label: "Colesterol (mg/dL)", field: "colesterol" },
            { label: "Triglicéridos (mg/dL)", field: "trigliceridos" },
            { label: "Urea (mg/dL)", field: "urea" },
            { label: "Ácido Úrico (mg/dL)", field: "acido_urico" },
            { label: "Albumina (g/dL)", field: "albumina" }
            // Opcionalmente podrías añadir "Otros" si es necesario en el frontend.
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={indicadores[field] || ""}
                onChange={(e) => handleInputChange("indicadores", field, e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {bioquimicoData[field] || "No disponible"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            handleSaveAndNext();
            router.push("/consultas/formularios/recordatorio24hrs")}}
        >
          Anterior
        </button>
        <button
          onClick={handleSaveAndNext}
          className="bg-[#11404E] text-white py-2 px-4 rounded-md"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Mediciones;
