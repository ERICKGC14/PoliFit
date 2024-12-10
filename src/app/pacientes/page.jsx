"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Input,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaFolderOpen } from "react-icons/fa";
import { Spinner } from "@nextui-org/react";
function Pacientes() {
  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("todos");
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Obtener la lista de pacientes del backend
  const fetchPacientes = async () => {
    try {
      const response = await fetch("/api/pacientes/getAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPacientes(data);
        // Inicia un "loader" al cargar la página
        const timer = setTimeout(() => {
          setIsLoading(false); // Oculta el loader después de cargar
        }, 2000); // Tiempo de carga simulado
        return () => clearTimeout(timer);
      } else {
        console.error("Error al obtener pacientes");
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // Filtros para la búsqueda y género
  useEffect(() => {
    const filtrados = pacientes.filter((paciente) => {
      const cumpleBusqueda = paciente.nombre
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const cumpleGenero =
        filtroGenero === "todos" || paciente.sexo === filtroGenero;
      return cumpleBusqueda && cumpleGenero;
    });
    setPacientesFiltrados(filtrados);
  }, [searchText, filtroGenero, pacientes]);

  const limpiarFiltros = () => {
    setSearchText("");
    setFiltroGenero("todos");
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
      <h1 className="text-4xl font-bold mb-6">Mis Pacientes</h1>

      {/* Sección de filtros */}
      <div className="bg-white shadow-md p-6 rounded-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              isClearable
              placeholder="Buscar por nombre..."
              startContent={<Search className="text-default-400 w-4 h-4" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4 flex-wrap">
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

      {/* Tabla de pacientes */}
      <div className="bg-white shadow-md rounded-md">
        <Table aria-label="Tabla de pacientes">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>CARRERA</TableColumn>
            <TableColumn>SEMESTRE</TableColumn>
            <TableColumn>GÉNERO</TableColumn>
            <TableColumn>EDAD</TableColumn>
            <TableColumn align="center">ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {pacientesFiltrados.map((paciente) => (
              <TableRow key={paciente.noBoleta}>
                <TableCell>
                  {`${paciente.nombre} ${paciente.apellidoPaterno || ""} ${
                    paciente.apellidoMaterno || ""
                  }`.trim()}
                </TableCell>
                <TableCell>{paciente.carrera}</TableCell>
                <TableCell>{paciente.semestre}</TableCell>
                <TableCell>{paciente.sexo}</TableCell>
                <TableCell>{paciente.edad}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      className="bg-[#11404E] text-white hover:bg-[#1a5c70] flex items-center space-x-2"
                      variant="flat"
                      onPress={() =>
                        router.push(`/pacientes/${paciente.noBoleta}`)
                      }
                    >
                      <FaFolderOpen className="text-white w-4 h-4" />
                      {/* Ícono */}
                      <span>Expediente</span> {/* Texto del botón */}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Pacientes;
