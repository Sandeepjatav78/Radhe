import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      // Image: Delivery person/Package concept
      image: "https://images.unsplash.com/photo-1615461168478-f218222eb619?q=80&w=2070&auto=format&fit=crop", 
      title: 'MEDICINES AT YOUR DOOR',
      subtitle: 'Skip the traffic. Get genuine medicines delivered to your doorstep in minutes.',
      btnText: 'Order Now'
    },
    {
      // Image: Hands holding pills/Health
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop",
      title: '100% GENUINE PRODUCTS',
      subtitle: 'From chronic care to daily essentials, we ensure quality and authenticity.',
      btnText: 'View Products'
    },
    {
      // Image: Doctor/Prescription vibe
      image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=2070&auto=format&fit=crop",
      title: 'UPLOAD PRESCRIPTION',
      subtitle: 'Have a doctor’s slip? Just upload it and let our pharmacists handle the rest.',
      btnText: 'Upload Now'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full mt-4 sm:mt-6 shadow-xl rounded-xl sm:rounded-2xl h-[55vh] sm:h-[75vh] overflow-hidden bg-gray-900 group">
      
      {/* --- Background Slideshow --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* --- Content Area --- */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 lg:px-24 z-10 max-w-4xl">
        <motion.div
            key={currentIndex + "-content"}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='text-left'
        >
            <p className="text-emerald-400 font-bold tracking-wider text-sm sm:text-base mb-2 uppercase">
                Radhe Pharmacy Delivery
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
            {slides[currentIndex].title.split(" ").map((word, i) => (
                <span key={i} className={i === 1 || i === 2 ? "text-emerald-500" : "text-white"}>
                    {word}{" "}
                </span>
            ))}
            </h1>
            <p className="text-gray-200 text-base sm:text-xl mt-4 max-w-lg leading-relaxed drop-shadow-md">
            {slides[currentIndex].subtitle}
            </p>

            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/collection')}
            className="mt-8 px-8 py-3.5 bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 transition-all flex items-center gap-2"
            >
            {slides[currentIndex].btnText}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            </motion.button>
        </motion.div>
      </div>

      {/* --- Slide Indicators --- */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-emerald-500" : "w-2 bg-gray-400/50 hover:bg-white"
                }`}
            />
        ))}
      </div>

    </div>
  );
};

export default Hero;