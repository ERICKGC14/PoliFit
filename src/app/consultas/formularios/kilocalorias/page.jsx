"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePaciente } from "../../context/PacienteContext";
import { Spinner } from "@nextui-org/react";
//import Cronometro from "../../components/Cronometro";

function Kilocalorias() {
  const { consultaData, updateConsultaData, sexo, edad, noBoleta } = usePaciente();
  // const [kilocaloriasData, setKilocaloriasData] = useState({});
  const [kilocaloriaData, setKilocaloriaData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading
  const router = useRouter();

  // Función para realizar la consulta a la API
  const fetchKilocaloriasAnterior = async () => {
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
        //throw new Error('No se pudo obtener la última consulta');
      }
  
      const data = await response.json();
      console.log("Data recuperado de mediciones: ", data);
      console.log("Data recuperado de mediciones pliegue: ", data.Kilocaloria);
      // Ejemplo de cómo actualizar los valores
      setKilocaloriaData(data.Kilocaloria || []);
    } catch (error) {
      console.log('Error al realizar la consulta de kilocalorias');
      // console.error("Error al realizar la consulta de pliegues:", error);
    }
  };

  let frecuencia = consultaData?.estiloDeVida?.actividadFisica?.frecuencia || 1;

  if(frecuencia === 1) {
    frecuencia = 1.2;
  } else if(frecuencia === 2) {
    frecuencia = 1.375;
  } else if(frecuencia === 3) {
    frecuencia = 1.55;
  } else if(frecuencia === 4) {
    frecuencia = 1.725;
  } else if(frecuencia === 5) {
    frecuencia = 1.9;
  }

  // console.log("Edad afuera: ", edad);
  // console.log("Nombre: ", nombre);
  // console.log("Sexo: ", sexo);
  // console.log("Edad: ", edad);
  // console.log("Revisar dato en kilo: ", consultaData.estiloDeVida.actividadFisica.frecuencia);

  const [kilocalorias, setKilocalorias] = useState({
    peso: 0,
    altura: 0,
    imc: 0,
    objetivo: "Mantener peso",
    formula: "Harris-Benedict",
    tmb: 0,
    af: frecuencia, // Actividad Física por defecto
    eta: 0,
    kcal: 0,
    hc: 0,
    prot: 0,
    lp: 0,
    hcPercentage: 30,
    protPercentage: 40,
    lpPercentage: 30,
    hc_g: 0,
    prot_g: 0,
    lp_g: 0,
  });

  useEffect(() => {
    const { peso, altura, formula, objetivo, af } = kilocalorias;
    if (peso && altura) {
      const imc = (peso / ((altura / 100) * (altura / 100))).toFixed(2);
      console.log("Peso: ", peso);
      console.log("Altura: ", altura);
      console.log("Formula: ", formula);
      console.log("Edad: ", edad);
      let tmb = 0, af1 = 0, kcal = 0, eta = 0;
      if (formula === "Harris-Benedict") {
        tmb = 66.473 + (13.752 * peso) + (5.003 * ((altura/100) * 100)) - (6.775 * edad); // 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * 25;
        console.log("TMB con Harris: ", tmb);
      } else if (formula === "Mifflin-St") {
        if (sexo === "Masculino") {
          tmb = (9.99*peso)+(6.25*((altura/100)*100))-(4.92*edad)+5;
        } else {
          tmb = (9.99*peso)+(6.25*((altura/100)*100))-(4.92*edad)-161;
        }
        // tmb = 10 * peso + 6.25 * altura - 5 * 25 + 5;
      } else if (formula === "Valencia") {
        tmb = (13.37*peso)+747,(11.02*peso)+679; // 370 + 21.6 * (peso * (1 - 0.15));
      }

      af1 = (tmb * af).toFixed(2);
      console.log("Af1: ", af1);
      eta = (tmb / 10).toFixed(2);
      console.log("ETA: ", eta);
      kcal = parseFloat(af1) + parseFloat(eta);
      console.log("Kcal: ", kcal);
      if (objetivo === "Aumentar peso") {
        kcal = kcal + 500;
      } else if (objetivo === "Disminuir peso") {
        kcal = kcal - 500;
      }
      console.log("Kcal2: ", kcal);
      setKilocalorias((prev) => ({ ...prev, imc, tmb: tmb.toFixed(2), kcal: kcal.toFixed(2), eta, }));
    }
  }, [kilocalorias.peso, kilocalorias.altura, kilocalorias.formula, kilocalorias.objetivo, kilocalorias.af]);

  useEffect(() => {
    const { kcal, hcPercentage, protPercentage, lpPercentage } = kilocalorias;
    if (kcal) {
      const hc = ((kcal * hcPercentage) / 100).toFixed(2);
      const prot = ((kcal * protPercentage) / 100).toFixed(2);
      const lp = ((kcal * lpPercentage) / 100).toFixed(2);
      const hc_g = (hc / 4).toFixed(2);
      const prot_g = (prot / 4).toFixed(2);
      const lp_g = (lp / 9).toFixed(2);
      setKilocalorias((prev) => ({
        ...prev,
        hc,
        prot,
        lp,
        hc_g,
        prot_g,
        lp_g,
      }));
    }
    console.log("kilocaloriasData: ", kilocaloriaData);
  }, [kilocalorias.kcal, kilocalorias.hcPercentage, kilocalorias.protPercentage, kilocalorias.lpPercentage]);

  useEffect(() => {
    fetchKilocaloriasAnterior();
    //console.log("consultaData.kilocalorias: ", consultaData.kilocalorias.peso);
    //console.log("consultaData.kilocalorias: ", consultaData.kilocalorias.altura);
    if (consultaData.kilocalorias && ((consultaData.kilocalorias.peso) || (consultaData.kilocalorias.altura))) {
      console.log("Hola desde asignacion de kilocalorias de useEffect");
      setKilocalorias(consultaData.kilocalorias);
    }
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 1500); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, [consultaData.kilocalorias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKilocalorias((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAndNext = () => {
    setIsLoading(true);
    updateConsultaData("kilocalorias", kilocalorias);
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
      <h2 className="text-2xl font-semibold mb-4">Kilocalorías</h2>

      <div className="bg-white shadow-md p-6 rounded-md">
        <div className="grid grid-cols-2 gap-6">
          {/* Inputs de Peso y Altura */}
          <div>
            <label className="block font-medium mb-1">Peso (kg)</label>
            <input
              type="number"
              name="peso"
              value={kilocalorias.peso || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Peso en kg"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["peso"] || "No disponible"}
            </p>
          </div>
          <div>
            <label className="block font-medium mb-1">Altura (cm)</label>
            <input
              type="number"
              name="altura"
              value={kilocalorias.altura || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Altura en cm"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["altura"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">IMC (Índice de Masa Corporal)</label>
            <input
              type="number"
              name="imc"
              value={kilocalorias.imc || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="00.00"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["imc"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Objetivo</label>
            <select name="objetivo"
              value={kilocalorias.objetivo}
              onChange={handleChange}
              className="w-full p-2 border rounded-md">
              <option value="Mantener peso">Mantener peso</option>
              <option value="Aumentar peso">Aumentar peso</option>
              <option value="Disminuir peso">Disminuir peso</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
                Objetivo anterior: {kilocaloriaData["objetivo"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Fórmula</label>
            <select
              name="formula"
              value={kilocalorias.formula}
              onChange={handleChange}
              className="w-full p-2 border rounded-md">
              <option value="Harris-Benedict">Harris-Benedict</option>
              <option value="Mifflin-St">Mifflin-St</option>
              <option value="Valencia">Valencia</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
                Fórmula anterior: {kilocaloriaData["formula"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">TMB (Tasa Metabólica Basal)</label>
            <input
              type="number"
              name="tmb"
              value={kilocalorias.tmb || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="0000.00"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["tmb"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">AF (Actividad Física)</label>
            <input
              type="number"
              name="af"
              value={kilocalorias.af || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["af"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">ETA (Energía Total Asignada)</label>
            <input
              type="number"
              name="eta"
              value={kilocalorias.eta || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="0000.00"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["eta"] || "No disponible"}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Kcal (Kilocalorías)</label>
            <input
              type="number"
              name="kcal"
              value={kilocalorias.kcal || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="0000.00"
            />
            <p className="text-sm text-gray-500 mt-1">
                Medición anterior: {kilocaloriaData["kcal"] || "No disponible"}
            </p>
          </div>

          {/* Porcentajes y resultados individuales */}
          <div>
            <label className="block font-medium mb-1">Porcentaje HC</label>
            <input
              type="number"
              name="hcPercentage"
              value={kilocalorias.hcPercentage || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="HC %"
            />
            <p className="text-sm text-gray-500 mt-1">
                Porcentaje anterior: {kilocaloriaData["hcPercentage"] || "No disponible"}
            </p>
          </div>
          <div>
            <label className="block font-medium mb-1">Porcentaje Proteínas</label>
            <input
              type="number"
              name="protPercentage"
              value={kilocalorias.protPercentage || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Proteínas %"
            />
            <p className="text-sm text-gray-500 mt-1">
                Porcentaje anterior: {kilocaloriaData["protPercentage"] || "No disponible"}
            </p>
          </div>
          <div>
            <label className="block font-medium mb-1">Porcentaje Lípidos</label>
            <input
              type="number"
              name="lpPercentage"
              value={kilocalorias.lpPercentage || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Lípidos %"
            />
            <p className="text-sm text-gray-500 mt-1">
                Porcentaje anterior: {kilocaloriaData["lpPercentage"] || "No disponible"}
            </p>
          </div>

          {/* Resultados en calorias */}
          <div>
            <label className="block font-medium mb-1">HC (calorías)</label>
            <input
              type="text"
              name="hc"
              value={kilocalorias.hc || ""}
              readOnly
              className="w-full p-2 border rounded-md" placeholder="HC (calorías)" />
            <p className="text-sm text-gray-500 mt-1">
              Calorías anteriores asignadas: {kilocaloriaData["hc"] || "No disponible"}
            </p>  
          </div>
          <div>
            <label className="block font-medium mb-1">Proteínas (calorías)</label>
            <input
              type="text"
              name="prot"
              value={kilocalorias.prot || ""}
              readOnly
              className="w-full p-2 border rounded-md" placeholder="Proteínas (calorías)" />
            <p className="text-sm text-gray-500 mt-1">
              Calorías anteriores asignadas: {kilocaloriaData["prot"] || "No disponible"}
            </p>  
          </div>
          <div>
            <label className="block font-medium mb-1">Lípidos (calorías)</label>
            <input
              type="text"
              name="lp"
              value={kilocalorias.lp || ""}
              readOnly
              className="w-full p-2 border rounded-md" placeholder="Lípidos (calorías)" />
            <p className="text-sm text-gray-500 mt-1">
              Calorías anteriores asignadas: {kilocaloriaData["lp"] || "No disponible"}
            </p>  
          </div>

          {/* Resultados en gramos */}
          <div>
            <label className="block font-medium mb-1">HC (g)</label>
            <input
              type="text"
              name="hc"
              value={kilocalorias.hc_g || ""}
              readOnly
              className="w-full p-2 border rounded-md" placeholder="HC (g)" />
            <p className="text-sm text-gray-500 mt-1">
              Gramos anteriores asignadas: {kilocaloriaData["hc_g"] || "No disponible"}
            </p>  
          </div>
          <div>
            <label className="block font-medium mb-1">Proteínas (g)</label>
            <input
              type="text"
              name="prot"
              value={kilocalorias.prot_g || ""}
              readOnly
              className="w-full p-2 border rounded-md" placeholder="Proteínas (g)" />
            <p className="text-sm text-gray-500 mt-1">
              Gramos anteriores asignadas: {kilocaloriaData["prot_g"] || "No disponible"}
            </p>  
          </div>
          <div>
            <label className="block font-medium mb-1">Lípidos (g)</label>
            <input
              type="text"
              name="lp"
              value={kilocalorias.lp_g || ""}
              readOnly
              className="w-full p-2 border rounded-md" placeholder="Lípidos (g)" />
            <p className="text-sm text-gray-500 mt-1">
              Gramos anteriores asignadas: {kilocaloriaData["lp_g"] || "No disponible"}
            </p>  
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
          onClick={() => {
            handleSaveAndNext();
            router.push("/consultas/formularios/mediciones");
          }}
        >
          Anterior
        </button>
        <button
          className="bg-[#11404E] text-white py-2 px-4 rounded-md"
          onClick={() => {
            handleSaveAndNext();
            router.push("/consultas/formularios/plan-alimentacion");
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Kilocalorias;