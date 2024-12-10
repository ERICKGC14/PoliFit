"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeaderPaths = ["/registro", "/inicio", "/restablecer"]; // Rutas específicas

  // Verifica si la ruta actual es dinámica y coincide con el patrón
  const isDynamicRoute = pathname.startsWith("/restablecer/");

  if (hideHeaderPaths.includes(pathname) || isDynamicRoute) {
    return null;
  }

  return <Header />;
}
