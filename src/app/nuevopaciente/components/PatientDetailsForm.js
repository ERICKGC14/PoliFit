"use client";

function PatientDetailsForm() {
  return (
    <div className="p-4 md:p-8">
      
      <h2 className="text-2xl font-semibold mb-4">Datos Personales</h2>
      <div className="bg-white shadow-md p-4 md:p-6 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            ["Nombre", "text"],
            ["Apellido Materno", "text"],
            ["Apellido Paterno", "text"],
            ["Fecha de nacimiento", "date"],
            ["Edad", "number"],
            ["Sexo", "select", ["Hombre", "Mujer", "Otro"]],
            ["Fecha de Registro", "date"],
            ["Estado Civil", "select", ["Casado", "Soltera"]],
            ["Ocupación", "text"],
            ["Teléfono", "text"],
            ["Email", "email"],
            ["Escuela", "text"],
            ["Carrera", "text"],
            ["Domicilio", "text"],
            ["No. de Boleta / Empleado", "text"],
            ["Turno", "text"],
            ["Tipo de Sangre", "text"],
          ].map(([label, type, options], index) => (
            <div key={index}>
              <label className="block font-medium mb-1">{label}</label>
              {type === "select" ? (
                <select className="w-full p-2 border rounded-md">
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input type={type} className="w-full p-2 border rounded-md" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md p-4 md:p-6 rounded-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block font-medium mb-1">Motivo de la Visita</label>
          <textarea className="w-full p-2 border rounded-md" rows="5"></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">Padecimiento Actual / Observaciones</label>
          <textarea className="w-full p-2 border rounded-md" rows="5"></textarea>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsForm;
