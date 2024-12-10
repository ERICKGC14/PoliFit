"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, createContext, useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaUserFriends,
  FaBook,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaSpinner,
} from "react-icons/fa";

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(null); // Estado para manejar la carga de opciones

  // Función para manejar el clic en las opciones
  const handleClick = (option) => {
    setLoading(option); // Establecer la opción como cargando
    setTimeout(() => {
      setLoading(null); // Simulamos un tiempo de carga, se puede reemplazar con una solicitud real
    }, 2000); // 2 segundos de simulación
    if(option === "cerrarSesion"){
      localStorage.clear();
    }
  };

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col " style={{ backgroundColor: "#F4F4F9" }}>
        <div className="p-4 pb-2 flex justify-between items-center">
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded ? "w-16" : "w-0"}`}
          >
            {/* Imagen del nutriólogo */}
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <FaBars />
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-2">
            <Link href="/nuevopaciente">
              <SidebarItem
                icon={<FaUser />}
                text="Nuevo Paciente"
                loading={loading === "nuevoPaciente"}
                onClick={() => handleClick("nuevoPaciente")}
              />
            </Link>
            <Link href="/consultas">
              <SidebarItem
                icon={<FaCalendarAlt />}
                text="Consultas"
                loading={loading === "consultas"}
                onClick={() => handleClick("consultas")}
              />
            </Link>
            <Link href="/pacientes">
              <SidebarItem
                icon={<FaUserFriends />}
                text="Pacientes"
                loading={loading === "pacientes"}
                onClick={() => handleClick("pacientes")}
              />
            </Link>
            <Link href="/agenda">
              <SidebarItem
                icon={<FaBook />}
                text="Mi Agenda"
                loading={loading === "agenda"}
                onClick={() => handleClick("agenda")}
              />
            </Link>
            <Link href="/perfil">
              <SidebarItem
                icon={<FaUserCircle />}
                text="Mi Perfil"
                loading={loading === "perfil"}
                onClick={() => handleClick("perfil")}
              />
            </Link>
            <Link href="/">
              <SidebarItem
                icon={<FaSignOutAlt />}
                text="Cerrar Sesión"
                loading={loading === "cerrarSesion"}
                onClick={() => handleClick("cerrarSesion")}
              />
            </Link>
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, text, loading, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className="relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group hover:bg-gray-300"
      style={{ color: "#11404E" }}
      onClick={onClick} // Agregar el evento onClick
    >
      {loading ? (
        <div className="animate-spin text-xl">
          <FaSpinner /> {/* Este es el ícono de loading (puedes cambiarlo) */}
        </div>
      ) : (
        icon
      )}
      <span
        className={`overflow-hidden transition-all duration-300 ${expanded ? "w-32 ml-3" : "w-0"}`}
      >
        {text}
      </span>

      {/*Diseño para cuando el sidebar se esconde y se muestran solo iconos */}
      {!expanded && (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6
          bg-gray-300 text-black-500 text-sm invisible opacity-0 translate-x-3 transition-all duration-300
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          style={{ color: "#11404E" }}
        >
          {text}
        </div>
      )}
    </li>
  );
}
