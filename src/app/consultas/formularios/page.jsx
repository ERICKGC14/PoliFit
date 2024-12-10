"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FormulariosPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la primera sección "estilovida" cuando se accede a /formularios
    router.push("/consultas/formularios/estilovida");
  }, [router]);

  return null;
}