import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

const CarouselSection = () => {
  const images = [
    { src: "/images/carrusel4.webp", alt: "Vista previa 1" },
    { src: "/images/carrusel3.webp", alt: "Vista previa 2" },
    { src: "/images/carrusel2.webp", alt: "Vista previa 3" },
    { src: "/images/carrusel1.webp", alt: "Vista previa 3" },
  ];

  return (
    <section id="carousel" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Vistas Previas del Sistema
        </h2>
        <Swiper
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image.src}
                alt={image.alt}
                width={1300}
                height={1000}
                className="rounded-lg shadow-lg mx-auto max-w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CarouselSection;
