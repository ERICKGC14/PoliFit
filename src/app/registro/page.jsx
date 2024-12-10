"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function RegistroForm() {
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    numeroEmpleado: "",
    especialidad: "",
    escuela: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const fieldLabels = {
    nombre: "Nombre",
    apellidos: "Apellidos",
    fechaNacimiento: "Fecha de Nacimiento",
    numeroEmpleado: "Número de Empleado",
    especialidad: "Especialidad",
    escuela: "Escuela",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Repetir Contraseña",
  };
  

  const [errors, setErrors] = useState({});
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.apellidos) newErrors.apellidos = "Los apellidos son obligatorios.";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!formData.numeroEmpleado) newErrors.numeroEmpleado = "El número de empleado es obligatorio.";
    if (!formData.especialidad) newErrors.especialidad = "La especialidad es obligatoria.";
    if (!formData.escuela) newErrors.escuela = "La escuela es obligatoria.";
  
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato inválido. Ejemplo: usuario@dominio.com";
    }
  
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    // Validar los checkboxes
    if (!isPrivacyChecked) {
      newErrors.privacy = "Debes aceptar el Aviso de Privacidad.";
    }

    if (!isTermsChecked) {
      newErrors.terms = "Debes aceptar los Términos y Condiciones.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;
    setLoading(true); // Activa el loading
    try {
      const response = await fetch("/api/nutriologos/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registro exitoso");
        router.push("/inicio");
      } else {
        setLoading(false);
        setErrors({ email: data.error || "Error al registrar" });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setErrors({ email: "Error al conectar con el servidor" });
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex justify-center items-center p-4">
      <div className="relative w-full max-w-4xl">
        <div className="absolute -left-40 top-1/4 transform -translate-y-1/2 bg-[#00796b] rounded-full w-96 h-96 z-0 animate-pulse-moderate"></div>
        <div className="absolute -right-40 top-3/4 transform -translate-y-1/2 bg-[#004d40] rounded-full w-96 h-96 z-0 animate-pulse-moderate"></div>
        <div className="relative z-10 bg-white shadow-lg rounded-lg overflow-hidden flex">
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#0b2f37]">Registro</h2>
            {["nombre", "apellidos", "fechaNacimiento", "numeroEmpleado", "especialidad"].map((field) => (
              <div key={field} className="mb-4">
                <label className="font-bold text-gray-700">{fieldLabels[field]}:</label>
                <input
                  type={field === "fechaNacimiento" ? "date" : "text"}
                  name={field}
                  placeholder={`Ingresa tu ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
              </div>
            ))}
          </div>
          <div className="w-1/2 p-8 bg-[#0b2f37] text-white rounded-r-lg">
            {["escuela", "email"].map((field) => (
              <div key={field} className="mb-4">
                <label className="font-bold">{fieldLabels[field]}:</label>
                <input
                  type="text"
                  name={field}
                  placeholder={`Ingresa tu ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
              </div>
            ))}
            {["password", "confirmPassword"].map((field, index) => (
              <div key={field} className="mb-4 relative">
                <label className="font-bold">{fieldLabels[field]}:</label>
                <input
                  type={field === "password" && showPassword || field === "confirmPassword" && showConfirmPassword ? "text" : "password"}
                  name={field}
                  placeholder={`Ingresa tu ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => field === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {field === "password"
                    ? (showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />)
                    : (showConfirmPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />)}
                </button>
                {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
              </div>
            ))}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="privacy" checked={isPrivacyChecked} onChange={() => setIsPrivacyChecked(!isPrivacyChecked)} className="mr-2" />
              <label htmlFor="privacy">Acepto Aviso de Privacidad <a href="#" className="text-green-600 underline">Ver aquí</a></label>
            </div>
            {errors.privacy && <span className="text-red-500 text-sm">{errors.privacy}</span>}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="terms" checked={isTermsChecked} onChange={() => setIsTermsChecked(!isTermsChecked)} className="mr-2" />
              <label htmlFor="terms">Acepto Términos y Condiciones <a href="#" className="text-green-600 underline">Ver aquí</a></label>
            </div>
            {errors.terms && <span className="text-red-500 text-sm">{errors.terms}</span>}
            {/* <button onClick={handleSubmit} className="w-full bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40]">Registrar</button> */}
            <button className="w-full bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40] flex justify-center items-center" onClick={handleSubmit}>
              {loading ? (
                <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full center"></div>
              ) : (
                "Registrar"
              )}
            </button>
            <div className="text-center mt-4">
              <a href="/inicio" className="text-white-500 underline">¿Ya tienes cuenta? Inicia sesión</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroForm;









