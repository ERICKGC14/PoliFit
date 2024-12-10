"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CarouselSection from "../components/CarouselSection";

const LandingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el loading

  const handleClick = (path) => {
    setLoading(true); // Activa el loading
    router.push(path); // Realiza la navegación
  };

  return (
    <div className="bg-white">
      {/* Encabezado */}
      <header className="px-6 bg-[#11404E] py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/Logo.jpeg"
            alt="Logo"
            width={50}
            height={50}
            className="md:w-16 md:h-16"
          />
          <div className="text-white">
            <h1 className="text-lg md:text-2xl font-bold">POLIFIT</h1>
            <p className="text-xs md:text-sm">Datos que transforman</p>
          </div>
        </div>
        <nav className="space-x-4">
          <a href="#about" className="text-gray-400 hover:text-white">
            Sobre Nosotros
          </a>
          {/* <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
            onClick={() => router.push("/inicio")}
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full"></div>
            ) : (
              "Acceder"
            )}
          </button> */}
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded" onClick={() => handleClick("/inicio")}>
            {loading ? (
              <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full"></div>
            ) : (
              "Acceder"
            )}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Prototipo de aplicación web para la administración y gestión de
          servicios de nutriología <br />
          <span className="text-[#11404E]">POLIFIT</span>
        </h1>
        {/* <p className="mt-4 text-gray-600">
          Quickly build landing pages that will help you get results fast.
        </p> */}
        <div className="mt-8 space-x-4">
          {/* <button
            className="bg-[#11404E] text-white px-6 py-2 rounded"
            onClick={() => router.push("/inicio")}
          >
            Acceder
          </button> */}
          <button className="bg-[#11404E] text-white px-6 py-2 rounded" onClick={() => handleClick("/inicio")}>
            {loading ? (
              <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full"></div>
            ) : (
              "Acceder"
            )}
          </button>
          {/* <button
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded"
            onClick={() => router.push("/registro")}
          >
            Unirse
          </button> */}
          <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded" onClick={() => handleClick("/registro")}>
            {loading ? (
              <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full"></div>
            ) : (
              "Unirse"
            )}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Presentan</h2>
          <p className="text-gray-600">
            Alumnos del Instituto Politécnico Nacional
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            {
              title: "Cervantes Meza Tamara ",
              desc: "Quick example text to build on the card..",
              img: "/images/tamaro.webp", // Replace with your converted image path
              
            },
            {
              title: "Cuadra Camacho Aurora Concepción",
              desc: "CON DESCRIPCION O SIN DESCRIPCION? DESCRIPCION DE QUE?.",
              img: "/images/auroro.webp", // Replace with your converted image path
            },
            {
              title: "Hernández Ramos Leam ",
              desc: "Quick example text to build on the card.",
              img: "/images/leamo.webp", // Replace with your converted image path
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center bg-gray-50 p-6 rounded-lg shadow"
            >
              <Image
                src={feature.img}
                alt={feature.title}
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:flex items-center space-x-6">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800">
              ¿De donde nace PoliFit?
            </h2>
            <p className="mt-4 text-gray-600">
              En el contexto actual del Instituto Politécnico Nacional (IPN),
              los nutriólogos enfrentan desafíos significativos en la gestión de
              sus servicios debido a la dependencia de sistemas de registro y
              seguimiento de los pacientes, en papel. Esta metodología
              tradicional limita severamente su eficiencia y eficacia,
              conduciendo a una gestión ineficiente, potencialmente insegura y
              en donde el seguimiento de los pacientes se ve obstaculizado por
              todos estos potenciales errores, lo que afecta negativamente la
              calidad de la atención nutricional proporcionada.
            </p>
            <p></p>
            <p className="mt-4 text-gray-600">
              En responsabilidad social con nuestra institución educativa,
              decidimos enfocarnos a el servicio de nutriología de la ESIME IPN
              a través de &quot;PoliFit&quot;, que surge como respuesta a estas
              necesidades, proponiendo el desarrollo de un prototipo de
              aplicación web que permita a los nutriólogos gestionar de manera
              eficiente la información y el seguimiento de sus pacientes. Este
              sistema busca eliminar la dependencia de los registros en papel,
              reducir los errores, aumentar la seguridad de los datos, y mejorar
              la calidad del seguimiento nutricional.
            </p>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">            
            <Image src="/images/landing1.webp" alt="Mockup" width={600} height={600} className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      <section id="about-right" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:flex items-center">
          {/* Imagen a la izquierda */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <Image src="/images/landing2.webp" alt="Mockup" width={600} height={600} className="rounded-lg shadow-lg" />
          </div>
          {/* Contenido a la derecha */}
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Conecta con el bienestar
            </h2>
            <p className="mt-4 text-gray-600">
              Nuestro objetivo es proporcionar una plataforma digital innovadora
              que conecte a los pacientes con los servicios de nutriología,
              optimizando la atención y promoviendo hábitos saludables. Descubre
              cómo PoliFit está revolucionando la salud nutricional.
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600">
              <li>Acceso rápido a información personalizada.</li>
              <li>Herramientas para el seguimiento nutricional.</li>
              <li>Promoción de estilos de vida saludables.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Carrusel */}
      <CarouselSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="text-center">
          <p>&copy; 2024 PoliFit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
