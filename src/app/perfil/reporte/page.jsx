"use client";
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

function Reporte() {
  const router = useRouter();
  const componentRef = useRef();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Datos estáticos (pueden ser reemplazados con datos del backend)
  const carreraGeneroData = [
    { carrera: "ICE", femenino: 3, masculino: 4 },
    { carrera: "IE", femenino: 3, masculino: 6 },
    { carrera: "ICA", femenino: 2, masculino: 2 },
    { carrera: "ISISA", femenino: 2, masculino: 0 },
    { carrera: "IF", femenino: 2, masculino: 2 },
  ];

  const estudiantesSemestreData = [
    { semestre: "1°", total: 3 },
    { semestre: "2°", total: 2 },
    { semestre: "3°", total: 2 },
    { semestre: "4°", total: 3 },
    { semestre: "5°", total: 2 },
    { semestre: "6°", total: 3 },
    { semestre: "7°", total: 2 },
    { semestre: "8°", total: 5 },
    { semestre: "9°", total: 3 },
  ];

  const diagnosticoIMCData = {
    bajoPeso: 4,
    pesoNormal: 7,
    sobrepeso: 14,
  };

  const diagnosticoPatologiaData = [
    { patologia: "Diabetes Tipo 1", total: 0 },
    { patologia: "Gastritis y/o Colitis", total: 6 },
    { patologia: "Anorexia", total: 1 },
    { patologia: "Anemia", total: 3 },
    { patologia: "SOP", total: 2 },
    { patologia: "Dislipidemias", total: 2 },
  ];

  // Manejador para aplicar el filtro por fechas
  const handleFilter = () => {
    console.log("Filtrando datos desde", startDate, "hasta", endDate);
    // Aquí iría la llamada al backend para obtener los datos filtrados
  };

  //Descarga en PDF
  const handleDownloadPDF = async () => {
  
    const html2pdf = (await import("html2pdf.js")).default; // Importa html2pdf dinámicamente
    const element = componentRef.current;
    //const element = document.getElementById("reportePDF");
    const options = {
      margin: 0.5,
      filename: "reporte_paciente.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2,
        useCORS: true, // Permite cargar recursos de otras fuentes
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    
    html2pdf().set(options).from(element).save();
  };
  

  useEffect(() => {
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 1500); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, []);

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
      <h1 className="text-3xl font-bold mb-6">Reporte de Pacientes</h1>

      {/* Filtros de Fecha */}
      <div className="flex items-center mb-6 space-x-4">
        <div>
          <label className="block font-medium mb-1">Fecha de Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Fecha de Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-[#11404E] text-white py-2 px-6 rounded-md hover:bg-[#0d2e38] transition"
        >
          Aplicar Filtro
        </button>
      </div>

      {/* Contenido del Reporte */}
      <div id="reportePDF" ref={componentRef}>
        {/* Tablas */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Tabla Carrera y Género */}
          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Carrera y Género</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-center">Carrera</th>
                  <th className="border p-2 text-center">F</th>
                  <th className="border p-2 text-center">M</th>
                </tr>
              </thead>
              <tbody>
                {carreraGeneroData.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{item.carrera}</td>
                    <td className="border p-2 text-center">{item.femenino}</td>
                    <td className="border p-2 text-center">{item.masculino}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabla Estudiantes por Semestre */}
          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4">
              Estudiantes por Semestre
            </h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-center">Semestre</th>
                  <th className="border p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesSemestreData.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{item.semestre}</td>
                    <td className="border p-2 text-center">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Diagnóstico por IMC */}
        <div className="bg-white shadow-md p-6 rounded-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Diagnóstico por IMC</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-center">Bajo Peso</th>
                <th className="border p-2 text-center">Peso Normal</th>
                <th className="border p-2 text-center">Sobrepeso y Obesidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-center">
                  {diagnosticoIMCData.bajoPeso}
                </td>
                <td className="border p-2 text-center">
                  {diagnosticoIMCData.pesoNormal}
                </td>
                <td className="border p-2 text-center">
                  {diagnosticoIMCData.sobrepeso}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla Diagnóstico por Patología Específica */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">
            Diagnóstico por Patología Específica
          </h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-center">Patología</th>
                <th className="border p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticoPatologiaData.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{item.patologia}</td>
                  <td className="border p-2 text-center">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Botón en la parte inferior */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.back()}
          className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
        >
          Regresar
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-[#11404E] text-white py-2 px-6 rounded-md hover:bg-[#0d2e38] transition"         
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
export default dynamic(() => Promise.resolve(Reporte), { ssr: false });
