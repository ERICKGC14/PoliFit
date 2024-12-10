"use client";

import React, { useState } from "react";

function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/nutriologos/reset-password-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Hemos enviado un enlace a tu correo electrónico.");
      } else {
        setMessage(data.error || "Hubo un problema. Intenta nuevamente.");
      }
    } catch (error) {
      setMessage("Error de conexión. Intenta más tarde.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Input de correo electrónico */}
            <div className="mb-4">
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-[#00796b] text-white py-3 rounded-md hover:bg-[#004d40]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Enlace"}
            </button>
          </form>

          {/* Mensaje de retroalimentación */}
          {message && (
            <p className="mt-4 text-center text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordRequest;
