"use client";
import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
const Header = () => {
  const [nutriologoData, setNutriologoData] = useState({});
  // Función para realizar la consulta a la API
  const fetchNutriologo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    try {
      // console.log("noBoleta en mediciones: ", noBoleta);
      const response = await fetch("/api/nutriologos/getNutriologo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error("No se pudo obtener al nutriologo");
      }

      const data = await response.json();
      //console.log("Data recuperado de nutriologo: ", data);

      setNutriologoData(data || []); // Si no hay datos, asignamos un arreglo vacío
    } catch (error) {
      console.log("Error al realizar la consulta de Nutriologo:", error);
    }
  };

  // useEffect para ejecutar la consulta al montar el componente
  useEffect(() => {
    fetchNutriologo();
  }, []);
  return (
    <header className="bg-[#11404E] p-4 flex justify-between items-center flex-wrap">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <Image
          src="/images/Logo.jpeg"
          alt="Logo"
          width={50}
          height={50}
          className="md:w-16 md:h-16"
        />
        <div className="text-white">
          <h1 className="text-lg md:text-2xl font-bold">POLIFIT</h1>
          <p className="text-xs md:text-sm">Datos que transforman</p>
        </div>
      </div>

      {/* User Info Section */}
      <div className="flex items-center space-x-4 text-white">
        <div className="text-right">
          <h2 className="text-sm md:text-lg font-bold">
            {nutriologoData.nombre + " " + nutriologoData.apellidos || " "} 
          </h2>
          <p className="text-xs md:text-sm">Nutricionista </p>
        </div>    
        <FaRegUserCircle size={40}/>    
        <button className="text-white">
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};
export default Header;
