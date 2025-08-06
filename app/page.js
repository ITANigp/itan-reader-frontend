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
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div className="">
      <section className="relative bg-black text-white h-[450px] md:h-[500px] xl:h-[750px]">
        <div className="absolute inset-0">
          <Image
            src="/images/reader-hero.png"
            alt="Books background"
            fill
            sizes="100vw"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
            className="object-cover h-full w-full"
          />
          {/* black overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
        </div>

        {/* Red Wave Pattern at Bottom */}
        <div className="absolute bottom-0 left-0 w-full z-10">
          <Image
            src="/images/decorative-wave.png"
            alt="Red wave"
            width={1440}
            height={150}
            className="w-full object-cover"
          />
        </div>

        {/* Navbar */}
        <div className="relative z-30 w-full">
          <div className="max-w-screen-xl mx-auto w-full flex justify-between items-center px-4 py-4">
            <Image
              src="/logo.svg"
              alt="ITAN Logo"
              width={140}
              height={56}
              className="w-auto h-16 md:h-18 lg:h-24 xl:h-32"
              priority
              sizes="140px"
            />
            <div className="flex justify-center min-h-[32px] lg:min-h-[46px] xl:min-h-[52px] px-4 md:px-6 xl:px-8">
              <Link
                href="/reader/sign_up"
                className="flex items-center bg-red-600 text-white p-2 md:px-6 md:py-2 rounded-md hover:bg-red-700 transition shadow text-base lg:text-lg"
                style={{ lineHeight: 1 }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Text & CTA */}
        <div className="relative z-20 flex flex-col items-center text-center h-full px-4 pt-8 md:pt-16">
          <motion.h1
            className="tiny:text-2xl text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Home Of Black Fiction Novels
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl xl:text-3xl mb-5 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
          >
            Explore the richest collection of <br /> afrocentric fiction
          </motion.p>
          <motion.h1
            className="pb-4 tiny:text-xl text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Enjoy Unlimited Reading with a 2 week free Trial
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/reader/sign_up"
              className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition lg:px-8 lg:py-4 xl:px-8 xl:py-4"
            >
              Get started for free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Animated Section: Find your Match */}
      {(() => {
        const ref = useRef(null);
        const inView = useInView(ref, { once: true, margin: "-100px" });
        const controls = useAnimation();
        useEffect(() => {
          if (inView) controls.start("visible");
        }, [inView, controls]);
        return (
          <motion.section ref={ref} className="py-8 md:py-10 xl:py-14 bg-black">
            <motion.h3
              className="px-8 text-xl md:text-4xl text-center text-white mb-6 md:mb-14 xl:mb-14"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              viewport={{ once: false, amount: 0.7 }}
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
                className=""
              >
                {[
                  {
                    src: "/images/readers/onboarding/ancestral-code.png",
                    alt: "ancestral code",
                  },
                  {
                    src: "/images/readers/onboarding/Lazarus.png",
                    alt: "Lazarus Convergence",
                  },
                  {
                    src: "/images/readers/onboarding/titan-race.png",
                    alt: "Titan race",
                  },
                  {
                    src: "/images/readers/onboarding/in-bed-with-her-guy.png",
                    alt: "in bed with her guy",
                  },
                  {
                    src: "/images/readers/onboarding/sons-of-the-7th-dawn.png",
                    alt: "sons of the 7th dawn",
                  },
                ].map((img, idx) => (
                  <SwiperSlide key={idx} className="flex justify-center">
                    <motion.div
                      initial={{ y: 40, scale: 0.95 }}
                      whileInView={{ y: 0, scale: 1 }}
                      exit={{ y: 40, scale: 0.95 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{
                        duration: 0.7,
                        delay: idx * 0.13,
                        type: "spring",
                        stiffness: 70,
                        damping: 20,
                      }}
                      style={{ willChange: "transform" }}
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
                /* Swiper pagination bullets custom color */
                .swiper-pagination-bullet {
                  background: #ffffff;
                  opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                  background: #ffffff;
                  opacity: 1;
                }
                .swiper-pagination {
                  position: static !important;
                  margin-top: 0.5rem;
                }
              `}</style>
            </div>
          </motion.section>
        );
      })()}

      <section className="relative bg-black py-8 md:py-10 xl:py-40 overflow-hidden text-center text-white">
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 60,
            damping: 18,
          }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
              x: [0, 15, -15, 0],
              y: [0, 8, -8, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1],
            }}
          >
            <Image
              src="/images/readers/onboarding/rotating-red-wave.png"
              alt="Rotating red wave background"
              fill
              className="object-cover opacity-70 border-none outline-none"
              style={{ border: "none", outline: "none" }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-20 xl:px-4"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 60,
            damping: 18,
          }}
        >
          <div className="px-4 text-2xl md:text-3xl lg:text-5xl font-medium md:font-semibold xl:font-semibold leading-10">
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                type: "spring",
                stiffness: 60,
                damping: 18,
              }}
            >
              Feel the Fire of Black storytelling
            </motion.p>
            <motion.p
              className="xl:my-5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                type: "spring",
                stiffness: 60,
                damping: 18,
              }}
            >
              where every book is a portal and{" "}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                type: "spring",
                stiffness: 60,
                damping: 18,
              }}
            >
              every word is power
            </motion.p>
          </div>
        </motion.div>
      </section>

      <section className="bg-black text-white py-16 md:py-24 xl:py-32 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8">
          {/* Image section */}
          <div className="w-full md:w-5/12 flex justify-center">
            <div className="relative group">
              <div className="w-[280px] sm:w-[320px] md:w-[350px] lg:w-[600px]">
                <img
                  src="/images/readers/onboarding/phone-picture.png"
                  alt="ITAN Reading Experience"
                  className="w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-red-600/10 rounded-2xl blur-xl -z-10 scale-110 opacity-50"></div>
            </div>
          </div>

          {/* Text section */}
          <div className="w-full md:w-7/12 text-center md:text-left">
            <blockquote className="relative">
              <div className="text-6xl text-red-600 opacity-20 absolute -top-4 -left-2 font-serif hidden md:block">
                "
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium md:font-semibold leading-relaxed md:leading-snug lg:leading-tight relative z-10">
                Step into the world of{" "}
                <span className="font-bold bg-white bg-clip-text text-transparent">
                  Afrocentric Storytelling
                </span>{" "}
                – where mystery meets magic, thrillers tangle with romance, and
                comics collide with sci-fi, all set to whisk you to the island{" "}
                <span className="italic font-bold text-red-400">"EXCITE"</span>
              </p>
              <div className="text-6xl text-red-600 opacity-20 absolute -bottom-8 -right-2 font-serif hidden md:block">
                "
              </div>
            </blockquote>
          </div>
        </div>
      </section>

      <FeatureCarousel />
      <FAQ />

      <section className="bg-black text-white py-12 px-4 sm:px-6 md:px-12 lg:px-20">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-8">
          Get All These Experiences on ITAN
        </h2>
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-20">
          <div className="flex-1 w-full flex flex-col justify-center">
            <p className="text-gray-300 mb-8 w-full text-base sm:text-lg md:text-xl xl:text-2xl text-center md:text-left xl:pr-12">
              Subscribe to our Newsletter and get exclusive access to
              binge-worthy stories from bestselling authors anytime, anywhere
              and follow the stories as they unfold!
            </p>
            <form className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0 xl:gap-4">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-grow px-6 py-4 rounded-md sm:rounded-l-md sm:rounded-r-none text-white bg-black border border-gray-700 focus:outline-none text-base xl:text-lg placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-7 py-4 rounded-md sm:rounded-l-none sm:rounded-r-md font-semibold text-base xl:text-lg whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="flex-1 w-full flex justify-center md:justify-end mt-8 md:mt-0">
            <div className="flex gap-3 md:gap-4 xl:gap-6 max-w-full">
              <img
                src="/images/readers/onboarding/the-color-of-belonging.png"
                alt="The Color of Belonging"
                className="w-32 sm:w-48 md:w-64 lg:w-80 xl:w-[28rem] h-auto rounded-md shadow-lg transform rotate-[6deg] max-w-full"
                style={{ minWidth: 0 }}
              />
              <img
                src="/images/readers/onboarding/lagos-to-lodon.png"
                alt="From Lagos to London"
                className="w-32 sm:w-48 md:w-64 lg:w-80 xl:w-[28rem] h-auto rounded-md shadow-lg transform rotate-[6deg] max-w-full"
                style={{ minWidth: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative bg-black text-white h-72 flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/readers/onboarding/subscribe-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20" />

        <div className="relative z-10 text-center px-4">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold mb-4">
            Are you an Author?
          </h2>
          <p className="max-w-xl mx-auto mb-6 text-gray-300">
            With ITAN Global Publishing, authors can self-publish their works,
            manage their books, and royalties all in one platform.
          </p>
          <Link href="/" className="bg-red-700 px-6 py-2 rounded font-medium">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}
