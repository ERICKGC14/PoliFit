"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@nextui-org/react";

function PerfilNutriologo() {
  const [nutriologo, setNutriologo] = useState(null); // Estado para almacenar datos reales del backend
  const [formData, setFormData] = useState(null); // Estado para manejar los datos del formulario
  const [isEditing, setIsEditing] = useState(false); // Modo edición
  const [alertMessage, setAlertMessage] = useState(""); // Mensaje de alerta
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
      }
  
      try {
        const response = await fetch("api/nutriologos/perfil", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar token en la cabecera
          },
        });
  
        const data = await response.json();
  
        console.log("Estado de la respuesta:", response.status);
        console.log("Cuerpo de la respuesta:", data);
        if (response.ok) {
          console.log("Perfil recibido:", data);
          setNutriologo(data); // Guardar datos reales en el estado
          setFormData(data); // Inicializar datos en el formulario
          // Inicia un "loader" al cargar la página
          const timer = setTimeout(() => {
            setIsLoading(false); // Oculta el loader después de cargar
          }, 1500); // Tiempo de carga simulado
          return () => clearTimeout(timer);
        } else {
          alert("Error al obtener el perfil: " + (data.error || "Error desconocido"));
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error.message);
        alert("Error al conectar con el servidor");
      }
    };
    fetchPerfil();
  }, []);
  

  // Manejador para activar el modo edición
  const handleEditClick = () => {
    setIsEditing(true);
  };
// Manejador para activar los cambios 
  const handleSaveClick = async () => {
    setIsEditing(false);
    console.log("Datos actualizados:", formData);
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/nutriologos/perfil", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.numeroEmpleado, // Incluye el ID del nutriólogo
          ...formData, // Los datos actualizados
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al actualizar perfil:", errorData.error);
        alert("Error al actualizar el perfil.");
        return;
      }
  
      const updatedData = await response.json();
      console.log("Perfil actualizado:", updatedData);
      setNutriologo(updatedData); // Actualiza los datos en el estado
      // Mostrar mensaje de éxito
      setAlertMessage("¡Perfil actualizado correctamente!");
      setTimeout(() => setAlertMessage(""), 3000); // Ocultar mensaje después de 3 segundos

    } catch (error) {
      console.error("Error al conectar con el servidor:", error.message);
      alert("Error al conectar con el servidor.");
    }
  };
  

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Redirigir al reporte
  const handleReporteClick = () => {
    setIsLoading(true);
    router.push("/perfil/reporte"); // Redirige a la página del reporte
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
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 border-2 border-[#00796b]">
        <div className="flex justify-center mb-6">
          <UserCircleIcon className="w-32 h-32 text-[#00796b]" />
        </div>
        <h1 className="text-2xl font-bold text-center text-[#0b2f37] mb-6">
          Perfil de {formData.nombre || "Nutriólogo"}
        </h1>
        {/* Mostrar alerta */}
        {alertMessage && (
          <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800 text-center">
            {alertMessage}
          </div>
        )}
        {/* Sección de Datos Personales */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#00796b] mb-4">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`p-3 rounded-md shadow-sm w-full ${
                  isEditing ? "border-2 border-[#00796b]" : "border border-gray-300 bg-gray-100"
                }`}
                readOnly={!isEditing}
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Apellidos:</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`p-3 rounded-md shadow-sm w-full ${
                  isEditing ? "border-2 border-[#00796b]" : "border border-gray-300 bg-gray-100"
                }`}
                readOnly={!isEditing}
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={`p-3 rounded-md shadow-sm w-full ${
                  isEditing ? "border-2 border-[#00796b]" : "border border-gray-300 bg-gray-100"
                }`}
                readOnly={!isEditing}
              />
            </div>

            {/* Número de Empleado */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Número de Empleado:</label>
              <input
                type="text"
                name="numeroEmpleado"
                value={formData.numeroEmpleado}
                className="bg-gray-100 p-3 rounded-md shadow-sm w-full border border-gray-300"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Información Profesional */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#00796b] mb-4">Información Profesional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Especialidad */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Especialidad:</label>
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                className={`p-3 rounded-md shadow-sm w-full ${
                  isEditing ? "border-2 border-[#00796b]" : "border border-gray-300 bg-gray-100"
                }`}
                readOnly={!isEditing}
              />
            </div>

            {/* Escuela */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Escuela:</label>
              <input
                type="text"
                name="escuela"
                value={formData.escuela}
                onChange={handleChange}
                className={`p-3 rounded-md shadow-sm w-full ${
                  isEditing ? "border-2 border-[#00796b]" : "border border-gray-300 bg-gray-100"
                }`}
                readOnly={!isEditing}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="bg-gray-100 p-3 rounded-md shadow-sm w-full border border-gray-300"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="text-center">
          {!isEditing ? (
            <button onClick={handleEditClick} className="bg-[#00796b] text-white px-6 py-3 rounded-md hover:bg-[#004d40]">
              Actualizar Información
            </button>
          ) : (
            <button onClick={handleSaveClick} className="bg-[#00796b] text-white px-6 py-3 rounded-md hover:bg-[#004d40]">
              Guardar
            </button>
          )}
          <button
            onClick={handleReporteClick}
            className="bg-[#11404E] text-white py-2 px-4 rounded-md hover:bg-[#0e2f3c] ml-4"
          >
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerfilNutriologo;
