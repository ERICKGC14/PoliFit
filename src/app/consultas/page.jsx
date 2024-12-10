"use client";
import { useState, useEffect, useMemo } from "react";
import { Spinner } from "@nextui-org/react"; // Puedes usar cualquier spinner o loader que prefieras
import { CronometroProvider } from "./context/CronometroContext";
import { useCronometro } from "./context/CronometroContext";
import Cronometro from "./components/Cronometro";
import PanelConsulta from "./components/PanelConsulta";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { usePaciente } from "../consultas/context/PacienteContext";
import { useRouter } from "next/navigation";

function Consultas() {
  // const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading

  // // Simula una demora para cargar la página (por ejemplo, datos desde el backend)
  // useEffect(() => {
  //   // Inicia un "loader" al cargar la página
  //   const timer = setTimeout(() => {
  //     setIsLoading(false); // Oculta el loader después de cargar
  //   }, 1000); // Tiempo de carga simulado
  //   return () => clearTimeout(timer);
  // }, []);

  // const handleIniciarConsulta = () => {
  //   // Muestra el loader antes de redirigir
  //   setIsLoading(true);
  //   router.push("/consultas/formularios/estilovida");
  // };

  // // Verifica si está cargando y muestra el spinner
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Spinner size="lg" color="primary" /> {/* Spinner de NextUI */}
  //     </div>
  //   );
  // }
  // Estados principales
  const { startTimer } = useCronometro();
  const [isOpen, setIsOpen] = useState(false);
  const { setPacienteInfo, resetConsultaData } = usePaciente();
  const [isSelectingPatient, setIsSelectingPatient] = useState(true);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter(); // Para manejar la navegación
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading

  const handleIniciarConsulta = () => {
    if (!selectedPaciente) return;
    setIsLoading(true);
    resetConsultaData();
    // Almacena la información completa del paciente en el contexto
    setPacienteInfo({
      noBoleta: selectedPaciente.noBoleta,
      nombre: selectedPaciente.nombre,
      apellidoPaterno: selectedPaciente.apellidoPaterno,
      apellidoMaterno: selectedPaciente.apellidoMaterno,
      email: selectedPaciente.email,
      telefono: selectedPaciente.telefono,
      edad: selectedPaciente.edad,
      sexo: selectedPaciente.sexo,
      // Añade más datos si los necesitas
    });

    startTimer();
    // Redirige a la página de formularios
    router.push("/consultas/formularios/estilovida");
  };
  // Estados para filtros
  const [filtroFechaTipo, setFiltroFechaTipo] = useState("todas");
  const [fechaEspecifica, setFechaEspecifica] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [consultas, setConsultas] = useState([]);

  // Funciones de manejo
  //Ver Consulta
  const handleViewConsulta = (consulta) => {
    console.log("Consulta seleccionada:", consulta); // Verifica el valor
    setSelectedConsulta(consulta);
  };

  const handleClosePanel = () => {
    setSelectedConsulta(null);
  };
  // Fetch de las consultas
  const fetchConsultas = async () => {
    try {
      const response = await fetch("/api/consulta/getAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token de autenticación
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Consultas obtenidas:", data);

        // Si la respuesta contiene un array de consultas, lo asignamos
        if (Array.isArray(data)) {
          setConsultas(data); // Actualiza el estado con las consultas obtenidas
        } else {
          // Si no es un array, lo tratamos como un error o respuesta vacía
          console.warn("No se encontraron consultas o respuesta inesperada");
          setConsultas([]); // Establece consultas como un array vacío
        }
      } else {
        const errorData = await response.json();
        console.error("Error al obtener consultas:", errorData.error);
        setConsultas([]); // En caso de error, establece consultas como un array vacío
      }
    } catch (error) {
      console.error("Error al obtener consultas:", error);
      setConsultas([]); // En caso de excepción, establece consultas como un array vacío
    }
  };

  // Función para convertir la fecha de formato YYYY-MM-DD a DD-MM-YYYY
  function formatearFecha(fechaBackend) {
    console.log("fecha backend consultas: ", fechaBackend);
    if(fechaBackend){
      let partes = fechaBackend.split("-"); // Asumiendo formato YYYY-MM-DD
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    else {
      return fechaBackend;
    }
  }

  // Llama a fetchConsultas al cargar la página
  useEffect(() => {
    fetchConsultas();
    // Inicia un "loader" al cargar la página
    const timer = setTimeout(() => {
      setIsLoading(false); // Oculta el loader después de cargar
    }, 2000); // Tiempo de carga simulado
    return () => clearTimeout(timer);
  }, []);

  const handleCreateConsulta = () => {
    setIsSelectingPatient(true);
    setIsOpen(true); // Abre el modal
  };

  const handlePacienteSelect = (pacienteId) => {
    if(isSelectingPatient){
      console.log("Paciente seleccionado con ID:", pacienteId); // Verificar el ID seleccionado
      console.log("Resultados de búsqueda 2:", searchResults);
      const paciente = searchResults.find((p) => p.noBoleta === pacienteId);
      console.log("Resultados de paciente:", paciente);
      setSelectedPaciente(paciente);
      setIsSelectingPatient(false);
      // console.log("dd")
    }
  };  

  const handleCloseModal = () => {
    setIsSelectingPatient(true);
    setSelectedPaciente(null);
    setIsOpen(false); // Cierra el modal
  };

  const searchPaciente = async (nombre) => {
    if(isSelectingPatient){
      try {
        // Asegura que el primer carácter de "nombre" sea mayúscula
        nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        const response = await fetch(`/api/pacientes/buscar?nombre=${nombre}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pasa el token desde localStorage
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Resultados de búsqueda:", data);
          setSearchResults(data);
        } else {
          const errorData = await response.json();
          console.error("Error al buscar paciente:", errorData.error);
          setSearchResults([]); // Vacía los resultados si hay error
        }
      } catch (error) {
        console.error("Error al buscar paciente:", error);
        setSearchResults([]);
      }
    }
  };

  // Función para calcular fechas relativas
  const getFechaRelativa = (dias) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
  };

  // Filtrado de consultas
  const consultasFiltradas = useMemo(() => {
    return (Array.isArray(consultas) ? consultas : []).filter((consulta) => {
      const fechaConsulta = new Date(consulta.fechaConsulta);
      let cumpleFecha = true;

      switch (filtroFechaTipo) {
        case "ultima_semana":
          const fechaSemana = new Date();
          fechaSemana.setDate(fechaSemana.getDate() - 7);
          cumpleFecha = fechaConsulta >= fechaSemana;
          break;

        case "ultimo_mes":
          const fechaMes = new Date();
          fechaMes.setMonth(fechaMes.getMonth() - 1);
          cumpleFecha = fechaConsulta >= fechaMes;
          break;

        case "fecha_especifica":
          if (consulta.fechaConsulta && fechaEspecifica) {
            try {
              // Convertir ambas fechas al mismo formato (YYYY-MM-DD)
              const consultaFecha = new Date(consulta.fechaConsulta)
                .toISOString()
                .split("T")[0];
              const filtroFecha = new Date(fechaEspecifica)
                .toISOString()
                .split("T")[0];
              cumpleFecha = consultaFecha === filtroFecha;
            } catch (error) {
              console.error("Error al procesar las fechas:", error);
              cumpleFecha = false;
            }
          } else {
            cumpleFecha = false;
          }
          break;

        default:
          cumpleFecha = true;
      }

      const cumpleGenero =
        filtroGenero !== "todos" ? consulta.sexo === filtroGenero : true;
      const cumpleBusqueda =
        consulta.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
        consulta.email.toLowerCase().includes(busqueda.toLowerCase());

      return cumpleFecha && cumpleGenero && cumpleBusqueda;
    });
  }, [consultas, filtroFechaTipo, fechaEspecifica, filtroGenero, busqueda]);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroFechaTipo("todas");
    setFechaEspecifica("");
    setFiltroGenero("todos");
    setBusqueda("");
  };

  // Render del filtro de fecha específica
  const renderFiltroFecha = () => {
    if (filtroFechaTipo === "fecha_especifica") {
      return (
        <Input
          type="date"
          value={fechaEspecifica}
          onChange={(e) => setFechaEspecifica(e.target.value)}
          startContent={<CalendarIcon className="text-default-400 w-4 h-4" />}
          className="w-48"
        />
      );
    }
    return null;
  };

  // Efecto para realizar la búsqueda en el backend cuando cambia el texto de búsqueda
  useEffect(() => {
    if (searchText) {
      searchPaciente(searchText);
      console.log("Paciente seleccionado:", searchText);
    } else {
      console.log("No hay resultados");
      setSearchResults([]);
      setIsSelectingPatient(true);
    }
  }, [searchText]);

  // // Verifica si está cargando y muestra el spinner
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Spinner size="lg" color="primary" /> {/* Spinner de NextUI */}
  //     </div>
  //   );
  // }

  return (
    <CronometroProvider>
      {/* Mostrar el cronómetro */}
      <Cronometro />
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size="lg" color="primary" /> {/* Spinner de NextUI */}
        </div>
      ) : (
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Mis Consultas</h2>
            <Button
              color="primary"
              className="bg-[#11404E] text-white hover:bg-[#1a5c70]"
              endContent={<Plus size={20} />}
              onPress={handleCreateConsulta}
            >
              Nueva Consulta
            </Button>
          </div>
          {/* Sección de filtros */}
          <div className="bg-white shadow-md p-6 rounded-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  isClearable
                  placeholder="Buscar por nombre o email..."
                  startContent={<Search className="text-default-400 w-4 h-4" />}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-4 flex-wrap">
                <Select
                  label="Filtrar por fecha"
                  placeholder="Seleccionar período"
                  value={filtroFechaTipo}
                  onChange={(e) => {
                    setFiltroFechaTipo(e.target.value);
                    if (e.target.value !== "fecha_especifica") {
                      setFechaEspecifica("");
                    }
                  }}
                  className="w-48"
                  startContent={
                    <CalendarIcon className="text-default-400 w-4 h-4" />
                  }
                >
                  <SelectItem key="todas" value="todas">
                    Todas las fechas
                  </SelectItem>
                  <SelectItem key="ultima_semana" value="ultima_semana">
                    Última semana
                  </SelectItem>
                  <SelectItem key="ultimo_mes" value="ultimo_mes">
                    Último mes
                  </SelectItem>
                  <SelectItem key="fecha_especifica" value="fecha_especifica">
                    Fecha específica
                  </SelectItem>
                </Select>
                {renderFiltroFecha()}
                <Select
                  label="Género"
                  placeholder="Todos"
                  value={filtroGenero}
                  onChange={(e) => setFiltroGenero(e.target.value)}
                  className="w-40"
                >
                  <SelectItem key="todos" value="todos">
                    Todos
                  </SelectItem>
                  <SelectItem key="Hombre" value="Hombre">
                    Hombre
                  </SelectItem>
                  <SelectItem key="Mujer" value="Mujer">
                    Mujer
                  </SelectItem>
                </Select>
                <Button
                  className="bg-[#11404E] text-white hover:bg-[#1a5c70]"
                  variant="flat"
                  onPress={limpiarFiltros}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Tabla de consultas */}
          <div className="bg-white shadow-md rounded-md">
            <Table aria-label="Tabla de consultas">
              <TableHeader>
                <TableColumn>PACIENTE</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>TELÉFONO</TableColumn>
                <TableColumn>FECHA CONSULTA</TableColumn>
                <TableColumn>HORA</TableColumn>
                <TableColumn>GÉNERO</TableColumn>
                <TableColumn align="center">ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {consultasFiltradas.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>{consulta.paciente || "N/A"}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${consulta.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {consulta.email || "N/A"}
                      </a>
                    </TableCell>
                    <TableCell>{consulta.telefono || "N/A"}</TableCell>
                    <TableCell>
                      {consulta.fechaConsulta
                        ? formatearFecha(consulta.fechaConsulta)
                        : "N/A"}
                    </TableCell>
                    <TableCell>{consulta.hora || "N/A"}</TableCell>
                    <TableCell>{consulta.sexo || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          className="bg-[#11404E] text-white hover:bg-[#1a5c70]"
                          variant="flat"
                          //onClick={() => router.push(`/consulta/${consulta.id}`)}
                          onPress={() => handleViewConsulta(consulta)}
                        >
                          Ver Consulta
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Modal para seleccionar paciente */}
          <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
            <ModalContent>
              <ModalHeader>
                <h2 className="text-2xl font-semibold">Seleccionar Paciente</h2>
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  allowsCustomValue
                  label="Buscar paciente"
                  placeholder="Escriba el nombre del paciente"
                  className="w-full"
                  items={searchResults}
                  onInputChange={(value) => setSearchText(value)}
                  onSelectionChange={handlePacienteSelect}
                >
                  {(paciente) => (
                    <AutocompleteItem key={paciente.noBoleta} textValue={`${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`}>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {`${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`}
                        </span>
                        <span className="text-xs text-default-400">
                          {paciente.email}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#11404E] text-white hover:bg-[#1a5c70]"
                  onPress={handleIniciarConsulta}
                  //isDisabled={!selectedPaciente} // Deshabilitar si no hay paciente seleccionado
                >
                  Iniciar Consulta
                </Button>
                <Button
                  className="bg-[#11404E] text-white hover:bg-[#1a5c70]"
                  onPress={() => (window.location.href = "/nuevopaciente")}
                >
                  Nuevo Paciente
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
      {selectedConsulta && (
          <PanelConsulta
            consulta={selectedConsulta}
            onClose={handleClosePanel}
          />
        )}
    </CronometroProvider>
  );
}

export default Consultas;
