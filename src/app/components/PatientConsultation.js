import { FaFolderOpen } from "react-icons/fa";

const PatientConsultations = ({ patient, onSwitchTab }) => (
  <>
    {/* Información del Paciente */}
    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
      <div className="space-y-2">
        <p><strong>Paciente:</strong> {patient.name}</p>
        <p><strong>Edad:</strong> {patient.age}</p>
        <p><strong>Boleta:</strong> {patient.id}</p>
        <p><strong>Carrera:</strong> {patient.career}</p>
        <p><strong>Fecha de registro:</strong> {patient.registrationDate}</p>
      </div>
      <div className="flex justify-end mt-4 md:mt-0">
        <button onClick={onSwitchTab} className="bg-[#11404E] text-white py-2 px-4 rounded-md w-fit">
          Datos Personales
        </button>
      </div>
    </div>

    {/* Título de Consultas */}
    <h2 className="text-2xl font-bold text-center mb-6">CONSULTAS</h2>

    {/* Tabla de Consultas */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#7fb6c6] text-white">
            <th className="px-4 py-2 border border-gray-300">Fecha de consulta</th>
            <th className="px-4 py-2 border border-gray-300">Peso</th>
            <th className="px-4 py-2 border border-gray-300">IMC</th>
            <th className="px-4 py-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patient.consultations.map((consultation, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F4F4F9]"}>
              <td className="px-4 py-2 border border-gray-300 text-center">{consultation.date}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">{consultation.weight}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">{consultation.imc}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <button className="bg-[#11404E] text-white py-1 px-2 rounded-md">
                  Ver expediente
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default PatientConsultations;
