"use client";
import React, { useState, useEffect } from "react";

const PanelConsulta = ({ consulta, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [actLaboralData, setActLaboralData] = useState({});
  const [actFisicaData, setActFisicaData] = useState({});
  const [toxicomaniaData, setToxicomaniaData] = useState({});
  const [habitosDietData, setHabitosDietData] = useState({});
  const [transGastroData, setTransGastroData] = useState({});
  const [ginecoObstreData, setGinecoObstreData] = useState({});
  const [recordatorioData, setRecordatorioData] = useState({});
  const [pliegueData, setPliegueData] = useState({});
  const [perimetroData, setPerimetroData] = useState({});
  const [diametroData, setDiametroData] = useState({});
  const [bioimpedanciaData, setBioimpedanciaData] = useState({});
  const [bioquimicoData, setBioquimicoData] = useState({});
  const [kilocaloriaData, setKilocaloriaData] = useState({});

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  // Función para realizar la consulta a la API
  const fetchFormularios = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    try {
      // console.log("noBoleta en mediciones: ", noBoleta);
      const response = await fetch(`/api/consulta/getConsulta?id_consulta=${consulta.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('No se pudo obtener la consulta');
      }
  
      const data = await response.json();
      console.log("Data recuperado de consulta: ", data);
      console.log("Data recuperado de actividad Laboral: ", data.ActLaboral);
      console.log("Data recuperado de actividad Física: ", data.ActFisica);

      const actFisica = data.ActFisica || [];
      console.log("Actividad Fisica: ", actFisica);
      // Recuperar los datos de Actividad Laboral y Actividad Física
      setActLaboralData(data.ActLaboral || []);  // Si no hay datos, asignamos un arreglo vacío
      setActFisicaData(data.ActFisica || []);    
      setToxicomaniaData(data.Toxicomania || []);  
      setHabitosDietData(data.HabitosDiet || []);  
      setTransGastroData(data.TransGastro || []);
      setGinecoObstreData(data.GinecoObstre || []);
      setRecordatorioData(data.Recordatorio || []);
      setPliegueData(data.Pliegue || []);
      setDiametroData(data.Diametro || []);
      setPerimetroData(data.Perimetro || []);
      setBioimpedanciaData(data.Bioimpedancium || []);
      setBioquimicoData(data.Bioquimico || []);
      setKilocaloriaData(data.Kilocaloria || []);
      // actFisicaData = actFisica;
      console.log("Actividad Fisica 2: ", actFisicaData);
    } catch (error) {
      console.error("Error al realizar la consulta de Consulta:", error);
    }
  };

  // useEffect para ejecutar la consulta al montar el componente
  useEffect(() => {
    fetchFormularios();
  }, []);

  const mapFrecuencia = (frecuencia) => {
    console.log("Frecuncia: ", frecuencia);
    switch (frecuencia) {
      case "1":
        return "Sedentario";
      case "2":
        return "Ligero";
      case "3":
        return "Moderado";
      case "4":
        return "Intenso";
      case "5":
        return "Muy Intenso";
      default:
        return "Frecuencia no definida";
    }
  };

  const mapEstres = (estres) => {
    console.log("Estres: ", estres);
    switch (estres) {
      case 1:
        return "Muy bajo";
      case 2:
        return "Bajo";
      case 3:
        return "Moderado";
      case 4:
        return "Alto";
      case 5:
        return "Muy Alto";
      default:
        return "Estres no definida";
    }
  };

  useEffect(() => {
    console.log("Actividad Fisica 3: ", actFisicaData);
    console.log("Length actFisicaData:", Array.isArray(actFisicaData) ? actFisicaData.length : "No es un arreglo");
    console.log("Número de propiedades en actFisicaData:", Object.keys(actFisicaData).length);
  }, [actFisicaData]);
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl p-6 rounded-md shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detalles de la Consulta</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            X
          </button>
        </div>

        {/* Secciones colapsables */}
        <div>
          {/* Datos generales */}
          <div className="border-b py-2">
            <button
              className="w-full text-left font-semibold"
              onClick={() => toggleSection("generales")}
            >
              Datos Generales
            </button>
            {activeSection === "generales" && (
              <div className="p-4">
                <p><strong>Paciente:</strong> {consulta.paciente}</p>
                <p><strong>Email:</strong> {consulta.email}</p>
                <p><strong>Teléfono:</strong> {consulta.telefono || "N/A"}</p>
                <p>
                  <strong>Fecha de Consulta:</strong>{" "}
                  {new Date(consulta.fechaConsulta).toLocaleDateString()}
                </p>
                <p><strong>Hora:</strong> {consulta.hora}</p>
                <p><strong>Sexo:</strong> {consulta.sexo}</p>
              </div>
            )}
          </div>

          {/* Formularios */}
          {/* Formulario de Estilo de Vida */}
          <div className="border-b py-2">
            <button
              className="w-full text-left font-semibold"
              onClick={() => toggleSection("estiloVida")}
            >
              Estilo de Vida
            </button>
            {activeSection === "estiloVida" && (
              <div className="p-4">
                {/* Sección de Actividad Laboral */}
                <div className="border-b py-2">
                  {actLaboralData && Object.keys(actLaboralData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Actividad Laboral</strong></p>
                      <p><strong>Ocupación:</strong> {actLaboralData.ocupacion || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {actLaboralData.descrip || "No disponible"}</p>
                      <p><strong>Horas totales:</strong> {actLaboralData.total_horas || "No disponible"}</p>
                      <p><strong>Nivel de estrés:</strong> {mapEstres(actLaboralData.n_estres) || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de actividad laboral disponibles.</p>
                  )}
                </div>
                {/* Sección de Actividad Física */}
                <div className="border-b py-2">
                  {actFisicaData && Object.keys(actFisicaData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Actividad Física</strong></p>
                      <p><strong>Tipo de actividad:</strong> {actFisicaData.tipo || "No disponible"}</p>
                      <p><strong>Frecuencia:</strong> {mapFrecuencia(actFisicaData.frecuencia) || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {actFisicaData.descripcion || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de actividad física disponibles.</p>
                  )}
                </div>
                {/* Sección de Toxicomania */}
                <div className="border-b py-2">
                  {toxicomaniaData && Object.keys(toxicomaniaData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Toxicomania</strong></p>
                      <p><strong>Medicamentos:</strong> {toxicomaniaData.medicamentos === "true" ? "Sí" : "No"}</p>
                      <p><strong>Alcohol:</strong> {toxicomaniaData.alcohol === "true" ? "Sí" : "No"}</p>
                      <p><strong>Tabaco:</strong> {toxicomaniaData.tabaco === "true" ? "Sí" : "No"}</p>
                      <p><strong>Café:</strong> {toxicomaniaData.cafe === "true" ? "Sí" : "No"}</p>
                      <p><strong>Farmacodependencia:</strong> {toxicomaniaData.farmacodep === "true" ? "Sí" : "No"}</p>
                      <p><strong>Otro:</strong> {toxicomaniaData.otro === "true" ? "Sí" : "No"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de toxicomania disponibles.</p>
                  )}
                </div>

                {/* Sección de Hábitos Dietéticos */}
                <div className="border-b py-2">
                  {habitosDietData && Object.keys(habitosDietData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Hábitos Dietéticos</strong></p>
                      <p><strong>Alimentos no deseados:</strong> {habitosDietData.alimen_ndesead || "No disponible"}</p>
                      <p><strong>Alimentos favoritos:</strong> {habitosDietData.alimen_fav || "No disponible"}</p>
                      <p><strong>Alergias:</strong> {habitosDietData.alergia || "No disponible"}</p>
                      <p><strong>Hora de desayuno:</strong> {habitosDietData.hora_bkf || "No disponible"}</p>
                      <p><strong>Hora de comida:</strong> {habitosDietData.hora_comida || "No disponible"}</p>
                      <p><strong>Hora de cena:</strong> {habitosDietData.hora_cena || "No disponible"}</p>
                      <p><strong>Hora de descanso:</strong> {habitosDietData.hora_desp || "No disponible"}</p>
                      <p><strong>Cantidad de agua (litros):</strong> {habitosDietData.cant_agua || "No disponible"}</p>
                      <p><strong>Cantidad de sal (gramos):</strong> {habitosDietData.cant_sal || "No disponible"}</p>
                      <p><strong>Cantidad de azúcar (gramos):</strong> {habitosDietData.cant_azu || "No disponible"}</p>
                      <p><strong>Alimentos no consumidos:</strong> {habitosDietData.alimen_nconsum || "No disponible"}</p>
                      <p><strong>Alimentos ingeridos:</strong> {habitosDietData.alimen_into || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de hábitos dietéticos disponibles.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/*Formulario de Trastornos*/}
          <div className="border-b py-2">
            <button
              className="w-full text-left font-semibold"
              onClick={() => toggleSection("trastornos")}
            >
              Trastornos
            </button>
            {activeSection === "trastornos" && (
              <div className="p-4">
                {/* Sección de Trastornos Gastrointestinales */}
                <div className="border-b py-2">
                  {transGastroData && Object.keys(transGastroData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Trastornos Gastrointestinales</strong></p>
                      <p><strong>Vómito:</strong> {transGastroData.vomito || "No"}</p>
                      <p><strong>Diarrea:</strong> {transGastroData.diarrea || "No"}</p>
                      <p><strong>Estreñimiento:</strong> {transGastroData.estreni || "No"}</p>
                      <p><strong>Colitis:</strong> {transGastroData.colitis || "No"}</p>
                      <p><strong>Gastritis:</strong> {transGastroData.gastri || "No"}</p>
                      <p><strong>Náuseas:</strong> {transGastroData.nauseas || "No"}</p>
                      <p><strong>Reflujo:</strong> {transGastroData.reflujo || "No"}</p>
                      <p><strong>Disfagia:</strong> {transGastroData.disfagia || "No"}</p>
                      <p><strong>Flatulencia:</strong> {transGastroData.flatulen || "No"}</p>
                      <p><strong>Distensión abdominal:</strong> {transGastroData.disten || "No"}</p>
                      <p><strong>Pirosis:</strong> {transGastroData.pirosis || "No"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de trastornos gastrointestinales disponibles.</p>
                  )}
                </div>
                {/* Sección de Gineco-Obstetricia */}
                <div className="border-b py-2">
                  {ginecoObstreData && Object.keys(ginecoObstreData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Gineco-Obstetricia</strong></p>
                      <p><strong>Gravidez (G):</strong> {ginecoObstreData.g || "No disponible"}</p>
                      <p><strong>Partos (P):</strong> {ginecoObstreData.p || "No disponible"}</p>
                      <p><strong>Cesáreas (C):</strong> {ginecoObstreData.c || "No disponible"}</p>
                      <p><strong>FUM (Fecha Última Menstruación):</strong> {ginecoObstreData.fum || "No disponible"}</p>
                      <p><strong>FUP (Fecha Última Prueba):</strong> {ginecoObstreData.fup || "No disponible"}</p>
                      <p><strong>SDGI (Síndrome Ginecológico):</strong> {ginecoObstreData.sdgi || "No disponible"}</p>
                      <p><strong>PPG (Periodo de Proceso Ginecológico):</strong> {ginecoObstreData.ppg || "No disponible"}</p>
                      <p><strong>Anticonceptivos:</strong> {ginecoObstreData.anticon || "No disponible"}</p>
                      <p><strong>Notas:</strong> {ginecoObstreData.notas || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos ginecológicos disponibles.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/*Formulario de Recordatorio 24 hrs.*/}
          <div className="border-b py-2">
            <button
              className="w-full text-left font-semibold"
              onClick={() => toggleSection("Recordatorio 24 hrs.")}
            >
              Recordatorio 24 hrs.
            </button>
            {activeSection === "Recordatorio 24 hrs." && (
              <div className="p-4">
                {/* Sección de Recordatorio */}
                <div className="border-b py-2">
                  {recordatorioData && Object.keys(recordatorioData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Recordatorio</strong></p>
                      <p><strong>Desayuno:</strong></p>
                      <p><strong>Hora:</strong> {recordatorioData.desayuno_hora || "No disponible"}</p>
                      <p><strong>Lugar:</strong> {recordatorioData.desayuno_lugar || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {recordatorioData.desayuno_descripcion || "No disponible"}</p>

                      <p><strong>Comida:</strong></p>
                      <p><strong>Hora:</strong> {recordatorioData.comida_hora || "No disponible"}</p>
                      <p><strong>Lugar:</strong> {recordatorioData.comida_lugar || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {recordatorioData.comida_descripcion || "No disponible"}</p>

                      <p><strong>Cena:</strong></p>
                      <p><strong>Hora:</strong> {recordatorioData.cena_hora || "No disponible"}</p>
                      <p><strong>Lugar:</strong> {recordatorioData.cena_lugar || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {recordatorioData.cena_descripcion || "No disponible"}</p>

                      <p><strong>Colación 1:</strong></p>
                      <p><strong>Hora:</strong> {recordatorioData.colacion_1_hora || "No disponible"}</p>
                      <p><strong>Lugar:</strong> {recordatorioData.colacion_1_lugar || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {recordatorioData.colacion_1_descripcion || "No disponible"}</p>

                      <p><strong>Colación 2:</strong></p>
                      <p><strong>Hora:</strong> {recordatorioData.colacion_2_hora || "No disponible"}</p>
                      <p><strong>Lugar:</strong> {recordatorioData.colacion_2_lugar || "No disponible"}</p>
                      <p><strong>Descripción:</strong> {recordatorioData.colacion_2_descripcion || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de recordatorio disponibles.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/*Formulario de Mediciones*/}
          <div className="border-b py-2">
            <button
              className="w-full text-left font-semibold"
              onClick={() => toggleSection("Mediciones")}
            >
              Mediciones
            </button>
            {activeSection === "Mediciones" && (
              <div className="p-4">
                {/* Sección de Pliegue */}
                <div className="border-b py-2">
                  {pliegueData && Object.keys(pliegueData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Pliegue</strong></p>
                      <p><strong>Subescapular (mm):</strong> {pliegueData.subescapular || "No disponible"}</p>
                      <p><strong>Tríceps (mm):</strong> {pliegueData.triceps || "No disponible"}</p>
                      <p><strong>Bíceps (mm):</strong> {pliegueData.biceps || "No disponible"}</p>
                      <p><strong>Cresta iliaca (mm):</strong> {pliegueData.cresta_iliaca || "No disponible"}</p>
                      <p><strong>Supraespinal (mm):</strong> {pliegueData.supraespinal || "No disponible"}</p>
                      <p><strong>Abdominal (mm):</strong> {pliegueData.abdominal || "No disponible"}</p>
                      <p><strong>Muslo frontal (mm):</strong> {pliegueData.muslo_frontal || "No disponible"}</p>
                      <p><strong>Pantorrilla medial (mm):</strong> {pliegueData.pantorrilla_medial || "No disponible"}</p>
                      <p><strong>Axilar medial (mm):</strong> {pliegueData.axilar_medial || "No disponible"}</p>
                      <p><strong>Pectoral (mm):</strong> {pliegueData.pectoral || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de pliegue disponibles.</p>
                  )}
                </div>
                {/* Sección de Perímetro */}
                <div className="border-b py-2">
                  {perimetroData && Object.keys(perimetroData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Perímetro</strong></p>
                      <p><strong>Cefálico (cm):</strong> {perimetroData.cefalico || "No disponible"}</p>
                      <p><strong>Cuello (cm):</strong> {perimetroData.cuello || "No disponible"}</p>
                      <p><strong>Mitad brazo relax (cm):</strong> {perimetroData.mitad_bra_rela || "No disponible"}</p>
                      <p><strong>Mitad brazo contraído (cm):</strong> {perimetroData.mitad_bra_contra || "No disponible"}</p>
                      <p><strong>Antebrazo (cm):</strong> {perimetroData.antebrazo || "No disponible"}</p>
                      <p><strong>Muñeca (cm):</strong> {perimetroData.muñeca || "No disponible"}</p>
                      <p><strong>Mesoesternal (cm):</strong> {perimetroData.mesoesternal || "No disponible"}</p>
                      <p><strong>Umbilical (cm):</strong> {perimetroData.umbilical || "No disponible"}</p>
                      <p><strong>Cintura (cm):</strong> {perimetroData.cintura || "No disponible"}</p>
                      <p><strong>Cadera (cm):</strong> {perimetroData.cadera || "No disponible"}</p>
                      <p><strong>Muslo (cm):</strong> {perimetroData.muslo || "No disponible"}</p>
                      <p><strong>Muslo medio (cm):</strong> {perimetroData.muslo_medio || "No disponible"}</p>
                      <p><strong>Pantorrilla (cm):</strong> {perimetroData.panto || "No disponible"}</p>
                      <p><strong>Tobillo (cm):</strong> {perimetroData.tobillo || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de perímetro disponibles.</p>
                  )}
                </div>
                {/* Sección de Diámetro */}
                <div className="border-b py-2">
                  {diametroData && Object.keys(diametroData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Diámetro</strong></p>
                      <p><strong>Biacromial (cm):</strong> {diametroData.biacromial || "No disponible"}</p>
                      <p><strong>Biileocrestal (cm):</strong> {diametroData.biileocrestal || "No disponible"}</p>
                      <p><strong>Longitud del pie (cm):</strong> {diametroData.long_pie || "No disponible"}</p>
                      <p><strong>Transversal torácico (cm):</strong> {diametroData.trans_torax || "No disponible"}</p>
                      <p><strong>Anteroposterior torácico (cm):</strong> {diametroData.ante_torax || "No disponible"}</p>
                      <p><strong>Húmero (cm):</strong> {diametroData.humero || "No disponible"}</p>
                      <p><strong>Bies muñeca (cm):</strong> {diametroData.bies_muñeca || "No disponible"}</p>
                      <p><strong>Fémur (cm):</strong> {diametroData.femur || "No disponible"}</p>
                      <p><strong>Bimaleolar (cm):</strong> {diametroData.bimaleolar || "No disponible"}</p>
                      <p><strong>Transversal pie (cm):</strong> {diametroData.trans_pie || "No disponible"}</p>
                      <p><strong>Longitud de la mano (cm):</strong> {diametroData.long_mano || "No disponible"}</p>
                      <p><strong>Transversal mano (cm):</strong> {diametroData.trans_mano || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de diámetro disponibles.</p>
                  )}
                </div>
                {/* Sección de Bioimpedancia */}
                <div className="border-b py-2">
                  {bioimpedanciaData && Object.keys(bioimpedanciaData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Bioimpedancia</strong></p>
                      <p><strong>Grasa total (%):</strong> {bioimpedanciaData.grasa_total || "No disponible"}</p>
                      <p><strong>Grasa subcutánea superior (%):</strong> {bioimpedanciaData.grasa_secsuper || "No disponible"}</p>
                      <p><strong>Grasa subcutánea inferior (%):</strong> {bioimpedanciaData.grasa_secinfe || "No disponible"}</p>
                      <p><strong>Grasa visceral (%):</strong> {bioimpedanciaData.grasa_visceral || "No disponible"}</p>
                      <p><strong>Masa libre de grasa (kg):</strong> {bioimpedanciaData.masa_libregrasa || "No disponible"}</p>
                      <p><strong>Masa muscular (kg):</strong> {bioimpedanciaData.masa_muscular || "No disponible"}</p>
                      <p><strong>Peso óseo (kg):</strong> {bioimpedanciaData.peso_oseo || "No disponible"}</p>
                      <p><strong>Agua corporal (%):</strong> {bioimpedanciaData.agua_corporal || "No disponible"}</p>
                      <p><strong>Edad metabólica (años):</strong> {bioimpedanciaData.edad_meta || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de bioimpedancia disponibles.</p>
                  )}
                </div>
                {/* Sección de Bioquímico */}
                <div className="border-b py-2">
                  {bioquimicoData && Object.keys(bioquimicoData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Bioquímico</strong></p>
                      <p><strong>Hemoglobina (g/dL):</strong> {bioquimicoData.homoglobina || "No disponible"}</p>
                      <p><strong>Glucosa (mg/dL):</strong> {bioquimicoData.glucosa || "No disponible"}</p>
                      <p><strong>Colesterol (mg/dL):</strong> {bioquimicoData.colesterol || "No disponible"}</p>
                      <p><strong>Triglicéridos (mg/dL):</strong> {bioquimicoData.trigliceridos || "No disponible"}</p>
                      <p><strong>Urea (mg/dL):</strong> {bioquimicoData.urea || "No disponible"}</p>
                      <p><strong>Ácido úrico (mg/dL):</strong> {bioquimicoData.acido_urico || "No disponible"}</p>
                      <p><strong>Albúmina (g/dL):</strong> {bioquimicoData.albumina || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos bioquímicos disponibles.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/*Formulario de Kilocalorías*/}
          <div className="border-b py-2">
            <button
              className="w-full text-left font-semibold"
              onClick={() => toggleSection("Kilocalorías")}
            >
              Kilocalorías
            </button>
            {activeSection === "Kilocalorías" && (
              <div className="p-4">
                {/* Sección de Kilocaloria */}
                <div className="border-b py-2">
                  {kilocaloriaData && Object.keys(kilocaloriaData).length > 0 ? (
                    <div className="mb-2">
                      <p><strong>Kilocalorías</strong></p>
                      <p><strong>Peso (kg):</strong> {kilocaloriaData.peso || "No disponible"}</p>
                      <p><strong>Altura (cm):</strong> {kilocaloriaData.altura || "No disponible"}</p>
                      <p><strong>IMC (kg/m²):</strong> {kilocaloriaData.imc || "No disponible"}</p>
                      <p><strong>Objetivo:</strong> {kilocaloriaData.objetivo || "No disponible"}</p>
                      <p><strong>Fórmula utilizada:</strong> {kilocaloriaData.formula || "No disponible"}</p>
                      <p><strong>TMB (Tasa Metabólica Basal):</strong> {kilocaloriaData.tmb || "No disponible"}</p>
                      <p><strong>AF (Actividad Física):</strong> {kilocaloriaData.af || "No disponible"}</p>
                      <p><strong>ETA (Energía Total Asignada):</strong> {kilocaloriaData.eta || "No disponible"}</p>
                      <p><strong>Kcal requeridas:</strong> {kilocaloriaData.kcal || "No disponible"}</p>

                      <p><strong>Macronutrientes:</strong></p>
                      <p><strong>Hidratos de carbono (calorías):</strong> {kilocaloriaData.hc || "No disponible"}</p>
                      <p><strong>Hidratos de carbono (g):</strong> {kilocaloriaData.hc_g || "No disponible"}</p>
                      <p><strong>Hidratos de carbono (%):</strong> {kilocaloriaData.hcPercentage || "No disponible"}</p>
                      <p><strong>Proteínas (calorías):</strong> {kilocaloriaData.prot || "No disponible"}</p>
                      <p><strong>Proteínas (g):</strong> {kilocaloriaData.prot_g || "No disponible"}</p>
                      <p><strong>Proteínas (%):</strong> {kilocaloriaData.protPercentage || "No disponible"}</p>
                      <p><strong>Lípidos (calorías):</strong> {kilocaloriaData.lp || "No disponible"}</p>
                      <p><strong>Lípidos (g):</strong> {kilocaloriaData.lp_g || "No disponible"}</p>
                      <p><strong>Lípidos (%):</strong> {kilocaloriaData.lpPercentage || "No disponible"}</p>
                    </div>
                  ) : (
                    <p>No hay datos de kilocaloría disponibles.</p>
                  )}
                </div>  
              </div>
            )}
          </div>
          
          {/*["Estilo de Vida", "Antecedentes", "Diagnósticos"].map(
            (form, index) => (
              <div className="border-b py-2" key={index}>
                <button
                  className="w-full text-left font-semibold"
                  onClick={() => toggleSection(form)}
                >
                  {form}
                </button>
                {activeSection === form && (
                  <div className="p-4">
                    <p>
                      Aquí se mostrarán los datos registrados en el formulario{" "}
                      <strong>{form}</strong>.
                    </p>
                    {/* Este contenido debe ser dinámico basado en los datos }
                  </div>
                )}
              </div>
            )
          )*/}
        </div>
      </div>
    </div>
  );
};

export default PanelConsulta;
