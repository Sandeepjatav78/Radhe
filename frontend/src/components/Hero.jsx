import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      // Pharmacy Shelf Image
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1169&auto=format&fit=crop",
      title: 'RADHE PHARMACY',
      subtitle: 'Genuine Medicines. Trusted Care. Right at your Doorstep.',
    },
    {
      // Doctor/Prescription Image
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1170&auto=format&fit=crop",
      title: 'UPLOAD PRESCRIPTION',
      subtitle: 'Don\'t know what to buy? Just upload your doctor\'s slip.',
    },
    {
      // Baby/Family Care
      image: "https://images.unsplash.com/photo-1555633514-abafa6dba411?q=80&w=687&auto=format&fit=crop",
      title: 'HEALTHCARE ESSENTIALS',
      subtitle: 'Vitamins, Baby Care, and Personal Hygiene products.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full mt-4 sm:mt-8 shadow-md rounded-xl sm:rounded-2xl h-[50vh] sm:h-[70vh] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.h1
          key={currentIndex + "-title"}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white tracking-wide drop-shadow-lg"
        >
          {slides[currentIndex].title}
        </motion.h1>
        <motion.p
          key={currentIndex + "-sub"}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base sm:text-xl text-gray-100 mt-4 max-w-2xl drop-shadow-md"
        >
          {slides[currentIndex].subtitle}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/collection')}
          className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition"
        >
          Order Medicines
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;