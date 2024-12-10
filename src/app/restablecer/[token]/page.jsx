"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RestablecerContrasena({ params }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      if (resolvedParams && resolvedParams.token) {
        setToken(resolvedParams.token);
        console.log("Token recibido:", resolvedParams.token);
      }
    }

    fetchParams();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Token enviado al backend:", token);
      console.log("Nueva contraseña enviada:", newPassword);
      const payload = { newPassword };
      const response = await fetch(
        `/api/nutriologos/reset-password/gettoken?token=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setMessage("Contraseña restablecida con éxito. Redirigiendo...");
        setTimeout(() => router.push("/inicio"), 3000);
      } else {
        const data = await response.json();
        setMessage(
          data.error || "Hubo un problema al restablecer la contraseña."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Hubo un error al procesar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex justify-center items-center p-4">
      <div className="relative w-full max-w-md">
        {/* Círculos decorativos */}
        <div className="absolute -left-28 top-1/4 transform -translate-y-1/2 bg-[#00796b] rounded-full w-72 h-72 z-0 animate-pulse-moderate"></div>
        <div className="absolute -right-28 top-3/4 transform -translate-y-1/2 bg-[#004d40] rounded-full w-72 h-72 z-0 animate-pulse-moderate"></div>

        {/* Contenedor principal */}
        <div className="relative z-10 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#0b2f37]">
            Restablecer Contraseña
          </h2>
          <p className="mb-4 text-center text-gray-700">
            Ingresa tu nueva contraseña y confirma para continuar.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Input de nueva contraseña */}
            <div className="mb-4 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showNewPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Input de confirmar contraseña */}
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-[#00796b] text-white py-3 rounded-md hover:bg-[#004d40]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Restablecer Contraseña"}
            </button>
          </form>

          {/* Mensaje de retroalimentación */}
          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("éxito") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
