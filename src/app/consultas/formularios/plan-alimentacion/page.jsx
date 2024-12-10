"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
//import html2pdf from "html2pdf.js";
import Image from "next/image";
import { usePaciente } from "../../context/PacienteContext";
import { Spinner } from "@nextui-org/react";

function PlanAlimentacion() {
  const { nombre, edad } = usePaciente();
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading
  const { consultaData, guardarConsulta } = usePaciente();
  const router = useRouter();

  const componentRef = useRef();
  const [fechaConsulta, setFechaConsulta] = useState("");
  // Estado para la tabla editable con 5 filas
  const [tableData, setTableData] = useState(
    Array(5).fill({ fecha: "", pesoActual: "", pesoPerdidoGanado: "" })
  );

  const [quantities, setQuantities] = useState({
    cereales: "",
    verduras: "",
    frutas: "",
    lacteos: "",
    origen: "",
    leguminosas: "",
    grasas: "",
  });

  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    setFechaConsulta(today); // Establece la fecha actual como predeterminada
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 1500); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, []);

  const handleTableChange = (index, field, value) => {
    const updatedTableData = [...tableData]; // Copia del array actual
    updatedTableData[index] = {
      ...updatedTableData[index], // Copia del objeto actual de la fila
      [field]: value, // Actualiza solo el campo modificado
    };
    setTableData(updatedTableData); // Guarda el nuevo estado
  };

  const handleQuantityChange = (section, value) => {
    setQuantities({
      ...quantities,
      [section]: value,
    });
  };

  const handleFinalSave = async () => {
    setIsLoading(true);
    try {
      await guardarConsulta(); // Llama a la función para guardar la consulta en el backend
      alert("Consulta finalizada y guardada con éxito.");
      router.push("/consultas"); // Redirige a la página principal de consultas
    } catch (error) {
      console.error("Error al guardar la consulta:", error);
      alert(
        "Hubo un error al finalizar la consulta. Por favor, inténtalo de nuevo."
      );
    }
  };

  // Función para generar el PDF con html2pdf.js
  const handleDownloadPDF = async () => {
    // Oculta los botones antes de generar el PDF
    const buttons = document.querySelectorAll(".no-print");
    buttons.forEach((button) => (button.style.display = "none"));
    const html2pdf = (await import("html2pdf.js")).default; // Dynamically import
    const options = {
      margin: 0.5, // Márgenes: [arriba, derecha, abajo, izquierda]
      filename: "plan_alimentacion.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, // Mejora la calidad del PDF
        useCORS: true, // Permite cargar recursos de otras fuentes
        ignoreElements: (el) => el.classList.contains("no-print"),
      },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    };

    const element = componentRef.current;

    // Generar el PDF
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        // Restaura los botones después de generar el PDF
        buttons.forEach((button) => (button.style.display = ""));
      })
      .catch((err) => {
        console.error("Error al generar el PDF:", err);
        // Restaura los botones en caso de error
        buttons.forEach((button) => (button.style.display = ""));
      });
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
    <div
      ref={componentRef}
      id="planPDF"
      style={{
        //width: "210mm", // Asegura el ancho del PDF
        minHeight: "297mm", // Altura mínima del PDF
        padding: "10mm",
        boxSizing: "border-box",
        backgroundColor: "white", // Fondo blanco para el PDF
      }}
      className="p-8"
    >
      {/* Contenedor de los logos en la parte superior */}
      <div className="flex justify-between mb-8 ">
        <div>
          {/* Logo a la izquierda */}
          <Image
            src="/images/Educacion_sello.png"
            alt="Logo izquierda"
            width={230}
            height={200}
          />
        </div>
        <div>
          {/* Logo a la derecha */}
          <Image
            src="/images/IPN_leyenda.png"
            alt="Logo derecha"
            width={270}
            height={100}
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        PLAN DE ALIMENTACIÓN POR EQUIVALENTES
      </h1>

      {/* Contenedor principal que será impreso */}
      <div className="bg-white shadow-md p-6 rounded-md mb-6">
        {/* Formulario de datos generales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Fecha de consulta:</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={fechaConsulta} // Establece la fecha predeterminada
              onChange={(e) => setFechaConsulta(e.target.value)} // Permite cambios manuales
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={nombre || ""}
              readOnly
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium mb-1">Diagnóstico:</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block font-medium mb-1">Edad:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={edad || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Peso:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={consultaData.kilocalorias.peso || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Altura (cm):</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={consultaData.kilocalorias.altura || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium mb-1">IMC:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={consultaData.kilocalorias.imc || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium mb-1">KCAL:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={consultaData.kilocalorias.kcal || ""}
              readOnly
            />
          </div>
        </div>

        {/* Distribución de nutrientes */}
        <h2 className="text-lg font-semibold mb-2">Distribución</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "HC", suffix: "%", field: "hcPercentage" },
            { label: "PROT", suffix: "%", field: "protPercentage" },
            { label: "LIP", suffix: "%", field: "lpPercentage" },
            { label: "MM", suffix: "%" },
            {
              label: "CINT",
              suffix: "cm",
              field: "cintura",
              section: "perimetros",
            },
            {
              label: "CADERA",
              suffix: "cm",
              field: "cadera",
              section: "perimetros",
            },
          ].map(({ label, suffix, field, section }) => (
            <div key={label} className="flex items-center">
              <label className="block font-medium mr-2">{label}:</label>
              {field ? (
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  value={
                    section === "perimetros"
                      ? consultaData.mediciones?.perimetros?.[field] || ""
                      : consultaData.kilocalorias?.[field] || ""
                  }
                  readOnly
                />
              ) : (
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  readOnly
                />
              )}
              <span className="ml-2">{suffix}</span>
            </div>
          ))}
        </div>

        {/* Tabla editable */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">FECHA</th>
              <th className="border border-gray-300 p-2">PESO ACTUAL</th>
              <th className="border border-gray-300 p-2">
                PESO PERDIDO O GANADO
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={row.fecha}
                    onChange={(e) =>
                      handleTableChange(index, "fecha", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={row.pesoActual}
                    onChange={(e) =>
                      handleTableChange(index, "pesoActual", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={row.pesoPerdidoGanado}
                    onChange={(e) =>
                      handleTableChange(
                        index,
                        "pesoPerdidoGanado",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Cereales y Tubérculos */}
      <div className="mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Cereales y Tubérculos</h2>
          <div className="flex items-center">
            <label className="mr-2 font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 p-2 h-12 border-2 border-black rounded-md"
              value={quantities.cereales}
              onChange={(e) => handleQuantityChange("cereales", e.target.value)}
            />
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Arroz cocido",
                "1/4 taza",
                "Pasta cocida",
                "1/2 taza",
                "Barra de cereal",
                "1 pieza",
              ],
              [
                "Elote en grano / crotones",
                "1/2 taza",
                "Avena cocida / cereal de caja",
                "1/2 taza",
                "Tortilla de harina",
                "1 pieza",
              ],
              [
                "Tortilla de maíz",
                "1 pieza",
                "Pan tostado / integral / blanco",
                "1 pieza",
                "Palomitas naturales",
                "2 1/2 tazas",
              ],
              [
                "Elote / papa cocida",
                "1 pieza mediana",
                "Bolillo / bollo / media noche",
                "1/2 pieza",
                "Tostadas horneadas / Salmas",
                "2 piezas / 1 paquete",
              ],
              [
                "Galletas María / habaneras",
                "5 piezas",
                "Avena cruda / amaranto / granola",
                "3 cucharadas",
              ],
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{row[0]}</td>
                <td className="border border-gray-300 p-2">{row[1]}</td>
                <td className="border border-gray-300 p-2">{row[2]}</td>
                <td className="border border-gray-300 p-2">{row[3]}</td>
                <td className="border border-gray-300 p-2">{row[4]}</td>
                <td className="border border-gray-300 p-2">{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Verduras */}
      <div className="mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Verduras</h2>
          <div className="flex items-center">
            <label className="mr-2 font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 h-12 p-2 border-2 border-black rounded-md"
              value={quantities.verduras}
              onChange={(e) => handleQuantityChange("verduras", e.target.value)}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Acelga / brócoli / calabaza (cocidos)",
                "1 taza",
                "Ejotes / espinaca / huazontle (cocidos)",
                "1/2 taza",
                "Cilantro / col / coliflor / lechuga / pápalo",
                "1/2 taza",
              ],
              [
                "Pimiento / setas / zanahoria (cocidos)",
                "1 taza",
                "Acelga / apio / berro / brócoli (crudos)",
                "1 taza",
                "Chilaca / chile cuaresmeño / poblano",
                "1/2 taza",
              ],
              [
                "Champiñón / col morada / betabel (crudos)",
                "1 pieza",
                "Flor de calabaza / hongos / nopal (crudos)",
                "1 pieza",
              ],
              [
                "Pepino / perejil / pimiento / jícama (crudos)",
                "1 taza",
                "Rábano / verdolaga / jitomate(crudos)",
                "1/2 taza",
              ],
            ].map((food, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{food[0]}</td>
                <td className="border border-gray-300 p-2">{food[1]}</td>
                <td className="border border-gray-300 p-2">{food[2]}</td>
                <td className="border border-gray-300 p-2">{food[3]}</td>
                <td className="border border-gray-300 p-2">{food[4]}</td>
                <td className="border border-gray-300 p-2">{food[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Frutas */}
      <div
        className="mb-6 text-sm"
        // style={{
        //   pageBreakBefore: "always", // Fuerza un salto de página antes de esta sección
        // }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Frutas</h2>
          <div className="flex items-center">
            <label className="mr-2 text-lg font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 h-12 p-2 border-2 border-black rounded-md"
              value={quantities.frutas}
              onChange={(e) => handleQuantityChange("frutas", e.target.value)}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Arándano fresco / deshidratado",
                "1/2 taza",
                "Mandarina / plátano dominico",
                "2 piezas",
                "Fresa / papaya / melón",
                "1 taza ",
              ],
              [
                "Chicozapote / zapote negro mediano",
                "1/2 taza",
                "Plátano / mango petacón mediano",
                "1/2 pieza",
                "Lichis / lima / limón real",
                "12 - 4 - 7 piezas",
              ],
              [
                "Guanábana / mango / manzana ",
                "1 pieza",
                "Moras",
                "3/4 taza",
                "Ciruela pasa",
                "2 piezas ",
              ],
              [
                "Pera / perón medianos",
                "1 pieza",
                "Toronja / membrillo mediano",
                "1 pieza",
                "Mamey / zapote",
                "1/3 - 1/4 piezas",
              ],
              [
                "Piña picada",
                "3/4 taza",
                "Chabacano",
                "4 piezas",
                "Ciruela criolla",
                "7 piezas ",
              ],
              [
                "Frambuesa / sandia / zarzamora",
                "1 taza",
                "Kiwi / mandarina / mango manila",
                "1 pieza",
                "Cereza / uvas",
                "20 - 18 piezas",
              ],
              [
                "Granada china / higo / mandarina",
                "2 piezas",
                "Naranja / tuna / guayaba / durazno",
                "2 piezas ",
              ],
            ].map((food, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{food[0]}</td>
                <td className="border border-gray-300 p-2">{food[1]}</td>
                <td className="border border-gray-300 p-2">{food[2]}</td>
                <td className="border border-gray-300 p-2">{food[3]}</td>
                <td className="border border-gray-300 p-2">{food[4]}</td>
                <td className="border border-gray-300 p-2">{food[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Seccion de lacteos*/}
      <div className="mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Lácteos</h2>
          <div className="flex items-center">
            <label className="mr-2 text-lg font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 h-12 p-2 border-2 border-black rounded-md"
              value={quantities.lacteos}
              onChange={(e) => handleQuantityChange("lacteos", e.target.value)}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Leche deslactosada light", "240 ml", "Leche entera", "240 ml"],
              ["Leche en polvo", "4 cucharadas", "Jocoque", "5 cucharadas"],
              [
                "Yogurt light para beber",
                "240 ml",
                "Alimento lácteo fermentado",
                "216 ml",
              ],
              ["Yogurt natural", "140 ml", "", ""],
            ].map((food, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{food[0]}</td>
                <td className="border border-gray-300 p-2">{food[1]}</td>
                <td className="border border-gray-300 p-2">{food[2]}</td>
                <td className="border border-gray-300 p-2">{food[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Origen animal */}
      <div className="mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Origen animal</h2>
          <div className="flex items-center">
            <label className="mr-2 text-lg font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 h-12 p-2 border-2 border-black rounded-md"
              value={quantities.origen}
              onChange={(e) => handleQuantityChange("origen", e.target.value)}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Bistec de res / bola / maciza / filete",
                "30 gr",
                "Atún drenado",
                "30 gr",
                "Salchicha de pavo",
                "1 pieza",
              ],
              [
                "Falda de res / cuete / chambaret",
                "35 gr",
                "Carne de cerdo maciza / pierna / molida",
                "35 gr",
                "Queso panela / fresco",
                "40 gr",
              ],
              [
                "Filete re huachinango / robalo / mojarra",
                "35 gr",
                "Hígado de pollo / hígado de res",
                "30 gr",
                "Requesón",
                "3 cucharadas",
              ],
              [
                "Pechuga de pollo / pollo sin piel",
                "35 gr",
                "Jamón de pavo / pierna",
                "2 rebanadas",
                "Surimi",
                "2/3 de barra",
              ],
              [
                "Queso cottage",
                "3 cucharadas",
                "Jamón de pavo / pierna",
                "2 rebanadas",
                "Huevo / Claras de huevo",
                "1 pieza, 2 piezas",
              ],
            ].map((food, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{food[0]}</td>
                <td className="border border-gray-300 p-2">{food[1]}</td>
                <td className="border border-gray-300 p-2">{food[2]}</td>
                <td className="border border-gray-300 p-2">{food[3]}</td>
                <td className="border border-gray-300 p-2">{food[4]}</td>
                <td className="border border-gray-300 p-2">{food[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Leguminosas */}
      <div className="mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Leguminosas</h2>
          <div className="flex items-center">
            <label className="mr-2 text-lg font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 h-12 p-2 border-2 border-black rounded-md"
              value={quantities.leguminosas}
              onChange={(e) =>
                handleQuantityChange("leguminosas", e.target.value)
              }
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Frijol", "1/2 taza", "Alverjón", "1/2 taza"],
              ["Haba", "1/2 taza", "Soya", "1/2 taza"],
              ["Lenteja", "1/2 taza", "", ""],
            ].map((food, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{food[0]}</td>
                <td className="border border-gray-300 p-2">{food[1]}</td>
                <td className="border border-gray-300 p-2">{food[2]}</td>
                <td className="border border-gray-300 p-2">{food[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Seccion de Leguminosas*/}
      <div className="mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Grasas con y sin proteína</h2>
          <div className="flex items-center">
            <label className="mr-2 text-lg font-bold">Cantidad:</label>
            <input
              type="text"
              className="w-20 h-12 p-2 border-2 border-black rounded-md"
              value={quantities.grasas}
              onChange={(e) => handleQuantityChange("grasas", e.target.value)}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#7fb6c6]">
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Alimento
              </th>
              <th className="border border-gray-300 p-2 font-semibold">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Aceite de canola / cártamo / girasol / maíz",
                "1 cucharada",
                "Aceitunas",
                "1/4 pieza",
              ],
              [
                "Aceite olivo / aguacate / soya ",
                "1 cucharada",
                "Almendra / avellana / cacahuates / nueces",
                "10 / 9 / 14 / 3 piezas",
              ],
              ["Aguacate", "1/3 pieza"],
            ].map((food, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
                <td className="border border-gray-300 p-2">{food[0]}</td>
                <td className="border border-gray-300 p-2">{food[1]}</td>
                <td className="border border-gray-300 p-2">{food[2]}</td>
                <td className="border border-gray-300 p-2">{food[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Objetivo */}
      <div className="mb-6 text-sm ">
        <h2 className="text-xl font-bold mb-4 text-center text-black">
          OBJETIVO
        </h2>
        <div className="border-2 border-gray-400 p-4 rounded-md">
          {/* Desayuno */}
          <div className="mb-4 ">
            <div className="bg-[#e2e2e8] font-bold text-[#11404E] py-2 px-8 rounded-full text-center">
              DESAYUNO
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div>
                  {/* Campo para cantidad */}
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center "
                  />
                  {/* Etiqueta de texto */}
                  <span>Cereal o tubérculo:</span>
                  {/* Campo para descripción */}
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none "
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center "
                  />{" "}
                  Alimento de Origen Animal:
                  <input
                    type="text"
                    className="w-64 h-12  p-2 border-b border-black focus:outline-none "
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center "
                  />{" "}
                  Verdura:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none "
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center "
                  />{" "}
                  Fruta:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Leguminosas:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Leche o yogurt:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Aceite y grasas (semillas):
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colación Matutina */}
          <div className="mb-4">
            <h3 className="bg-[#e2e2e8] font-bold text-[#11404E] py-2 px-8 rounded-full text-center">
              COLACIÓN MATUTINA
            </h3>
            <div className="grid grid-cols-2">
              <div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Ración:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Ración:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comida */}
          <div className="mb-4">
            <h3 className="bg-[#e2e2e8] font-bold text-[#11404E] py-2 px-8 rounded-full text-center">
              COMIDA
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Cereal o tubérculo:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Alimento de Origen Animal:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Verdura:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Fruta:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Leguminosas:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Leche o yogurt:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Aceite y grasas (semillas):
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colación Vespertina */}
          <div className="mb-4">
            <h3 className="bg-[#e2e2e8] font-bold text-[#11404E] py-2 px-8 rounded-full text-center">
              COLACIÓN VESPERTINA
            </h3>
            <div className="grid grid-cols-2">
              <div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Ración:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Ración:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cena */}
          <div>
            <h3 className="bg-[#e2e2e8] font-bold text-[#11404E] py-2 px-8 rounded-full text-center">
              CENA
            </h3>
            <div
              className="grid grid-cols-2 gap-4"
              style={{ pageBreakInside: "avoid" }}
            >
              <div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Cereal o tubérculo:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Alimento de Origen Animal:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Verdura:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Fruta:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Leguminosas:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Leche o yogurt:
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="number"
                    className="w-16 h-12 p-2 border-b border-black focus:outline-none text-center"
                  />{" "}
                  Aceite y grasas (semillas):
                  <input
                    type="text"
                    className="w-64 h-12 p-2 border-b border-black focus:outline-none"
                    style={{ marginLeft: "8px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acciones (excluidos del PDF mediante una clase especial) */}
      <div className="flex justify-between space-x-4 no-print">
        <div className="space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#11404E] text-white px-4 py-2 rounded-md hover:bg-[#7fb6c6] no-print"
          >
            Descargar en PDF
          </button>
          <button
            //onClick={handlePrint}
            className="bg-[#11404E] text-white px-4 py-2 rounded-md hover:bg-[#7fb6c6] no-print"
          >
            Enviar al correo electrónico
          </button>
        </div>
        <button
          onClick={() => {
            handleFinalSave();
          }}
          className="bg-[#11404E] text-white py-2 px-4 rounded-md no-print"
        >
          Terminar Consulta
        </button>
      </div>
    </div>
  );
}

export default PlanAlimentacion;
