"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function LoginForm() {
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.general = "Usuario o contraseña inválidos.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.general = "Usuario o contraseña inválidos.";
    }

    if (!formData.password) {
      newErrors.general = "Usuario o contraseña inválidos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;
    setLoading(true); // Activa el loading
    try {
      const response = await fetch("/api/nutriologos/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Login exitoso", data);
        router.push("/nuevopaciente");
      } else {
        setLoading(false); // Activa el loading
        // Mensaje de error genérico si el inicio de sesión falla
        setErrors({ general: "Usuario o contraseña inválidos." });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setErrors({ general: "Error al conectar con el servidor." });
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex justify-center items-center p-4">
      <div className="relative w-full max-w-md">
        {/* Círculos decorativos respetados */}
        <div className="absolute -left-28 top-1/4 transform -translate-y-1/2 bg-[#00796b] rounded-full w-72 h-72 z-0 animate-pulse-moderate"></div>
        <div className="absolute -right-28 top-3/4 transform -translate-y-1/2 bg-[#004d40] rounded-full w-72 h-72 z-0 animate-pulse-moderate"></div>
        <div className="relative z-10 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#0b2f37]">Inicio de Sesión</h2>
          <form onSubmit={handleSubmit}>
            {/* Campo de correo electrónico */}
            <div className="mb-4">
              <label className="font-bold text-gray-700">Correo electrónico:</label>
              <input
                type="text"
                name="email"
                placeholder="usuario@dominio.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Campo de contraseña con botón de visibilidad */}
            <div className="mb-4 relative">
              <label className="font-bold text-gray-700">Contraseña:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mensaje de error general debajo del campo de contraseña */}
            {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

            {/* Botones de acción */}
            <div className="flex space-x-4 mb-4">
              {/* <button
                type="submit"
                className="w-full bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40]"
              >
                Ingresar
              </button> */}
              <button className="w-full bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40] flex justify-center items-center" type="submit">
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full center"></div>
                ) : (
                  "Ingresar"
                )}
              </button>
              <button
                type="button"
                className="w-full bg-[#00796b] text-white p-2 rounded-md hover:bg-[#004d40]"
                onClick={() => setFormData({ email: "", password: "" })}
              >
                Cancelar
              </button>
            </div>
          </form>
          <div className="text-center">
            <a href="/restablecer" className="text-[#004d40] underline">¿Olvidaste la contraseña?</a>
          </div>
          <div className="text-center mt-2">
            <a
              href="/registro"
              className="text-[#004d40] underline"
              onClick={() => router.push("/registro")}
            >
              ¿No tienes cuenta? Regístrate ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;




