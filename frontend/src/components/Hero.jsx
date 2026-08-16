import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1615461168478-f218222eb619?q=80&w=2070&auto=format&fit=crop",
      tag: "⚡ FAST DELIVERY",
      title: 'Schedule Your Delivery',
      subtitle: 'Choose your preferred time slot (6 AM - 11 PM). We deliver exactly when you want.',
      btnText: 'Order Now',
      link: '/collection'
    },
    {
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop",
      tag: "✅ 100% TRUSTED",
      title: 'Genuine Medicines Only',
      subtitle: 'Sourced from trusted and licensed distributors. No compromise on your health.',
      btnText: 'View Products',
      link: '/collection'
    },
    {
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
      tag: "📝 Rx ORDERS",
      title: 'Prescription Made Easy',
      subtitle: 'Upload your prescription and we will deliver exactly what the doctor ordered.',
      btnText: 'Explore Collection',
      link: '/collection'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl h-[200px] sm:h-[380px] overflow-hidden bg-gray-900 group shadow-lg">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-10 lg:px-14 z-10 max-w-2xl">
        <motion.div
          key={currentIndex + "-content"}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full mb-2 sm:mb-3 bg-brand shadow-lg shadow-brand/40"
          >
            {slides[currentIndex].tag}
          </motion.span>

          <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg mb-1.5 sm:mb-3">
            {slides[currentIndex].title}
          </h1>

          <p className="text-gray-200 text-[11px] sm:text-base max-w-[260px] sm:max-w-md leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none">
            {slides[currentIndex].subtitle}
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(slides[currentIndex].link)}
            className="text-[11px] sm:text-sm px-4 py-2 sm:px-6 sm:py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/40 hover:bg-brand-dark transition-colors flex items-center gap-2 w-max"
          >
            {slides[currentIndex].btnText}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-10 flex gap-1.5 sm:gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex ? "w-6 sm:w-8 bg-brand" : "w-2 bg-gray-400/70 hover:bg-white"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default Hero;