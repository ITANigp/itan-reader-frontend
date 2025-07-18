"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import dynamic from "next/dynamic";
import FAQ from "@/components/reader/FQA";
import Link from "next/link";

// Dynamically import FeatureCarousel with SSR disabled
const FeatureCarousel = dynamic(
  () => import("@/components/reader/FeatureCarousel"),
  { ssr: false }
);

function GenreSwiper() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const images = [
    {
      src: "/images/readers/onboarding/ancestral-code.png",
      alt: "ancestral code",
    },
    {
      src: "/images/readers/onboarding/Lazarus.png",
      alt: "Lazarus Convergence",
    },
    { src: "/images/readers/onboarding/titan-race.png", alt: "Titan race" },
    {
      src: "/images/readers/onboarding/in-bed-with-her-guy.png",
      alt: "in bed with her guy",
    },
    {
      src: "/images/readers/onboarding/sons-of-the-7th-dawn.png",
      alt: "sons of the 7th dawn",
    },
  ];

  return (
    <motion.section ref={ref} className="py-8 md:py-10 xl:py-14 bg-black">
      <motion.h3
        className="px-8 text-2xl md:text-4xl text-center text-white mb-14"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.9,
          type: "spring",
          stiffness: 60,
          damping: 18,
        }}
      >
        Find your Match in More than 100 <br /> Genres and Categories
      </motion.h3>
      <div className="max-w-5xl mx-auto px-2 md:px-8 xl:mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={8}
          slidesPerView={2}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            430: { spaceBetween: 8, slidesPerView: 2.2 },
            490: { spaceBetween: 10, slidesPerView: 2.5 },
            640: { spaceBetween: 12, slidesPerView: 3 },
            768: { spaceBetween: 14, slidesPerView: 4 },
            1024: { spaceBetween: 16, slidesPerView: 5 },
          }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.13,
                  type: "spring",
                  stiffness: 70,
                  damping: 20,
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={150}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 120px, 150px"
                  quality={85}
                  loading={idx === 0 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL="/images/readers/onboarding/blur-placeholder.png"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="w-full flex justify-center mt-4">
          <div className="swiper-pagination !static" />
        </div>
        <style>{`
          .swiper-pagination-bullet { background: #ffffff; opacity: 0.5; }
          .swiper-pagination-bullet-active { background: #ffffff; opacity: 1; }
          .swiper-pagination { position: static !important; margin-top: 0.5rem; }
        `}</style>
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <div>
      <section className="relative bg-black text-white h-[450px] md:h-[500px] xl:h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="/images/reader-hero.png"
            alt="African-themed book hero background"
            fill
            sizes="100vw"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="/images/readers/onboarding/blur-placeholder.png"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full z-10">
          <Image
            src="/images/decorative-wave.png"
            alt="Red wave"
            width={1440}
            height={150}
            className="w-full object-cover"
          />
        </div>
        <div className="relative z-30 w-full">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-4">
            <Image
              src="/logo.svg"
              alt="ITAN Logo"
              width={140}
              height={56}
              className="w-auto h-16 md:h-18 lg:h-24 xl:h-32"
              priority
              sizes="140px"
            />
            <Link
              href="/reader/sign_up"
              className="flex items-center bg-red-600 text-white p-2 md:px-6 md:py-2 rounded-md hover:bg-red-700 transition shadow text-base lg:text-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <div className="relative z-20 flex flex-col items-center text-center h-full px-4 pt-8 md:pt-16">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Home of Black Fiction Novels
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl xl:text-3xl mb-5 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
          >
            Explore the richest collection of black <br /> fiction in one app
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/reader/sign_up"
              className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition"
            >
              Get started
            </Link>
          </motion.div>
        </div>
      </section>

      <GenreSwiper />

      <section className="relative bg-black py-8 md:py-10 xl:py-40 overflow-hidden text-center text-white">
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ y: 0, x: 0 }}
          animate={{ y: [0, 10, -10, 0], x: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/readers/onboarding/rotating-red-wave.png"
            alt="Rotating red wave background"
            fill
            className="object-cover opacity-70"
          />
        </motion.div>
        <div className="relative z-10 xl:px-4">
          <div className="px-4 text-2xl md:text-3xl lg:text-5xl font-medium md:font-semibold leading-10">
            <p>Feel the Fire of Black storytelling</p>
            <p className="xl:my-5">where every book is a portal and</p>
            <p>every word is power</p>
          </div>
        </div>
      </section>

      <FeatureCarousel />
      <FAQ />
      {/* Continue with the newsletter and author CTA sections as needed */}
    </div>
  );
}
