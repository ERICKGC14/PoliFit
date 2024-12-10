"use client";
import { Inter } from "next/font/google";
import "./globals.css";
//import Header from "./components/Header";
//import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";
import SidebarWrapper from "./components/SidebarWrapper";
import HeaderWrapper from "./components/HeaderWrapper";

// Carga de fuentes
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Detecta si la página actual es la landing
  const isLandingPage = pathname === "/";

  return (
    <html lang="es">
      <body className={inter.className}>
        <NextUIProvider>
          {/* Renderiza solo el contenido si es la página de landing */}
          {!isLandingPage && <HeaderWrapper />}
          <div className={`flex flex-col md:flex-row min-h-screen`}>
            {!isLandingPage && <SidebarWrapper />}
            <main className={`flex-grow ${isLandingPage ? "" : "p-4"}`}>
              {children}
            </main>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
