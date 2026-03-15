"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AnimatedLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading completion - remove this in production and
  // tie to your actual data loading if needed
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Variants for container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Loading overlay animation
  const overlayVariants = {
    hidden: { y: 0 },
    visible: {
      y: "-100%",
      transition: {
        duration: 0.7,
        ease: [0.65, 0, 0.35, 1], // Custom easing
      },
    },
  };

  return (
    <>
      {/* Animated overlay that slides away */}
      <motion.div
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={overlayVariants}
        className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Your stories deserve an audience...
          </p>
        </div>
      </motion.div>

      {/* Main content with staggered children */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </>
  );
}
