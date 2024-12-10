"use client";
import { useState, useMemo, useEffect } from "react";
import CalendarView from "./components/calendarview";
import CitasTable from "./components/citastable";
import ModalCita from "./components/ModalCita";
import ModalEliminar from "./components/ModalEliminar";
import HeaderAgenda from "./components/HeaderAgenda";
import { Spinner } from "@nextui-org/react";

function AgendaCitas() {
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isDeleteModalOpen: false,
    isEditing: false,
  });
  const [viewType, setViewType] = useState("list");
  const [selectedCita, setSelectedCita] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el loading
  const [citas, setCitas] = useState([
    // {
    //   idCita: 1,  
    //   // noBoleta: 1,
    //   nombre: "Juan Pérez",
    //   // email: "juan@ejemplo.com",
    //   // telefono: "5512345678",
    //   fecha_consulta: "2024-02-15",
    //   hora_consulta: "10:00",
    // },
    // {
    //   idCita: 2,
    //   // noBoleta: 2,
    //   nombre: "María García",
    //   // email: "maria@ejemplo.com",
    //   // telefono: "5587654321",
    //   fecha_consulta: "2024-02-16",
    //   hora_consulta: "11:30",
    // },
  ]);

  //   // Función para realizar la consulta a la API
  // const fetchCitas = async () => {
  //   try {
  //     const response = await fetch("api/citas/getAll");
  //     if (!response.ok) {
  //       throw new Error("Error al obtener los datos de citas");
  //     }
  //     const data = await response.json();
  //     setCitas(data); // Aquí se asume que `data` es un objeto con los campos de pliegues
  //   } catch (error) {
  //     console.error("Error al realizar la consulta de citas:", error);
  //   }
  // };

  // Función para realizar la consulta a la API
  const fetchCitas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    try {
      // console.log("noBoleta en mediciones: ", noBoleta);
      const response = await fetch("api/citas/getAll", {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('No se pudo obtener las citas');
      }
  
      const data = await response.json();
      console.log("Data recuperado de citas: ", data);
      setCitas(data); 
      // Inicia un "loader" al cargar la página
      const timer = setTimeout(() => {
        setIsLoading(false); // Oculta el loader después de cargar
      }, 1500); // Tiempo de carga simulado
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error al realizar la consulta de citas", error);
    }
  };

  const fetchDeleteCita = async (idCita) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    try {
      // console.log("noBoleta en mediciones: ", noBoleta);
      const response = await fetch(`api/citas/delete?idCita=${idCita}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('No se pudo eliminar la cita');
      } else {
        alert("Cita eliminada correctamente");
      }
    } catch (error) {
      console.error("Error al realizar la eliminación de cita", error);
    }
  };

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     await fetchCitas();
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  const [newCita, setNewCita] = useState({
    //idCita: "",
    // noBoleta: "",
    nombre: "",
    // email: "",
    // telefono: "",
    fecha_consulta: "",
    hora_consulta: "",
  });

  // Funcion para el calendario
  const getCalendarEvents = useMemo(() => {
    console.log("citas: ", citas);
    return citas.map((cita) => ({
      id: cita.idCita,
      title: cita.nombre,
      start: `${cita.fecha_consulta}T${cita.hora_consulta}:00`,
      end: `${cita.fecha_consulta}T${cita.hora_consulta.split(":")[0]}:${
        parseInt(cita.hora_consulta.split(":")[1]) + 30
      }:00`,
      backgroundColor: "#11404E",
      borderColor: "#11404E",
    }));
  }, [citas]);

  // const [isOpen, setIsOpen] = useState(false);
  const [isSelectingPatient, setIsSelectingPatient] = useState(true);

  const handleOpenModal = (cita = null) => {
    setNewCita(
      cita || {
        //idCita: "",
        // noBoleta: "",
        nombre: "",
        // email: "",
        // telefono: "",
        fecha_consulta: "",
        hora_consulta: "",
      }
    );
    setModalState({
      isModalOpen: true,
      isDeleteModalOpen: false,
      isEditing: !!cita,
    });
    setSelectedCita(cita);
    setIsSelectingPatient(true);
    // setIsOpen(true); // Abre el modal
  };

  // const [selectedPaciente, setSelectedPaciente] = useState(null);

  const handleCloseModal = () => {
    setModalState({ ...modalState, isModalOpen: false });
    setSelectedCita(null);
    setIsSelectingPatient(true);
    // setSelectedPaciente(null);
    // setIsOpen(false); // Cierra el modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalState.isEditing) {
      try {
        console.log("newCita en editing: ", newCita);
        console.log("selectedIdCita: ", selectedCita.idCita);
        const { nombre, fecha_consulta, hora_consulta } = newCita;
        const payload = {
          // noBoleta,
          nombre,
          fecha_consulta,
          hora_consulta,
        };
        console.log("Payload: ", payload);
        const response = await fetch(`api/citas/update?idCita=${selectedCita.idCita}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pasa el token desde localStorage
          },
          body: JSON.stringify(payload),
        });
        
        const data = await response.json();
        if (response.ok) {
          console.log("Cita actualizada con exito:", data);
          //setCitas([...citas, { ...newCita, idCita: data.idCita }]);
          alert("Actualización de cita exitosa");
        } else {
          console.error("Error al actualizar cita:", data.error);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
      setCitas(
        citas.map((cita) =>
          cita.idCita === selectedCita.idCita ? { ...newCita, idCita: cita.idCita } : cita
        )
      );
    } else {
      try {
        console.log("newCita: ", newCita);
        const { nombre, fecha_consulta, hora_consulta } = newCita;
        const payload = {
          // noBoleta,
          nombre,
          fecha_consulta,
          hora_consulta,
        };
        console.log("Payload: ", payload);
        const response = await fetch(`/api/citas/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pasa el token desde localStorage
          },
          body: JSON.stringify(payload),
        });
        
        const data = await response.json();
        if (response.ok) {
          console.log("Cita registrada con exito:", data);
          setCitas([...citas, { ...newCita, idCita: data.idCita }]);
          alert("Registro de cita exitoso");
        } else {
          console.error("Error al registrar cita:", data.error);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    }
    handleCloseModal();
  };

  const handleDelete = (cita) => {
    setSelectedCita(cita);
    setModalState({ ...modalState, isDeleteModalOpen: true });
  };

  const confirmDelete = () => {
    setCitas(citas.filter((cita) => cita.idCita !== selectedCita.idCita));
    setModalState({ ...modalState, isDeleteModalOpen: false });
    setSelectedCita(null);
    fetchDeleteCita(selectedCita.idCita);
  };

  // useEffect para ejecutar la consulta al montar el componente
  useEffect(() => {
    fetchCitas();
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
    <div className="p-6">
      <HeaderAgenda viewType={viewType} setViewType={setViewType} handleOpenModal={handleOpenModal} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewType === "calendar" ? (
          <CalendarView
            events={getCalendarEvents}
            handleEventClick={handleOpenModal}
            handleDateClick={handleOpenModal}
          />
        ) : (
          <CitasTable citas={citas} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />
        )}
      </div>

      <ModalCita
        isOpen={modalState.isModalOpen}
        isEditing={modalState.isEditing}
        selectedCita={selectedCita}
        newCita={newCita}
        setNewCita={setNewCita}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
      />

      <ModalEliminar
        isOpen={modalState.isDeleteModalOpen}
        selectedCita={selectedCita}
        confirmDelete={confirmDelete}
        handleClose={() => setModalState({ ...modalState, isDeleteModalOpen: false })}
      />
    </div>
  );
}

export default AgendaCitas;
