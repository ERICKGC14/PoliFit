import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import PatientConsultations from "./PatientConsultation";
import PatientDetailsForm from "../nuevopaciente/components/PatientDetailsForm";

const PacienteModal = ({ isOpen, onClose, patient }) => {
  const [activeTab, setActiveTab] = useState("consultations");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg shadow-lg relative max-h-[80vh] overflow-y-auto">
        {/* Botón de Cierre */}
        <div className="flex justify-between items-center mb-4">
          {activeTab === "details" && (
            <button
              onClick={() => setActiveTab("consultations")}
              className="text-[#11404E] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            >
              Regresar a Consultas
            </button>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Contenido del Modal: Consultas o Detalles Personales */}
        {activeTab === "consultations" && (
          <PatientConsultations
            patient={patient}
            onSwitchTab={() => setActiveTab("details")}
          />
        )}
        
        {activeTab === "details" && (
          <div className="overflow-y-auto max-h-[60vh]">
            <PatientDetailsForm patient={patient} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PacienteModal;
