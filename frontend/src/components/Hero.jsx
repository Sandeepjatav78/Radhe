import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      // Feature 1: Scheduled Delivery (Jo humne Place Order me banaya)
      image: "https://images.unsplash.com/photo-1615461168478-f218222eb619?q=80&w=2070&auto=format&fit=crop", 
      tag: "NEW FEATURE",
      title: 'SCHEDULE YOUR DELIVERY',
      subtitle: 'Choose your preferred time slot (6 AM - 11 PM). We deliver exactly when you want.',
      btnText: 'Order Now',
      link: '/collection'
    },
    {
      // Feature 2: Genuine Products
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop",
      tag: "100% TRUSTED",
      title: 'GENUINE MEDICINES ONLY',
      subtitle: 'Sourced directly from manufacturers. No middlemen, no compromise on health.',
      btnText: 'View Products',
      link: '/collection'
    },
    {
      // Feature 3: Prescription Upload
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
      tag: "EASY UPLOAD",
      title: 'UPLOAD PRESCRIPTION',
      subtitle: 'Don’t know what to order? Just upload your doctor’s slip and we will handle the rest.',
      btnText: 'Upload Now',
      link: '/contact' // Redirects to Contact page for upload
    },
  ];

  // Auto-Slide Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full mt-4 sm:mt-6 shadow-xl rounded-xl sm:rounded-2xl h-[50vh] sm:h-[70vh] overflow-hidden bg-gray-900 group">
      
      {/* --- Background Slideshow --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* --- Content Area --- */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 lg:px-24 z-10 max-w-3xl">
        <motion.div
            key={currentIndex + "-content"}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='text-left'
        >
            {/* Feature Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest shadow-lg shadow-emerald-500/30"
            >
              {slides[currentIndex].tag}
            </motion.div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight drop-shadow-lg mb-4">
            {slides[currentIndex].title.split(" ").map((word, i) => (
                <span key={i} className={i === 0 ? "text-emerald-400" : "text-white"}>
                    {word}{" "}
                </span>
            ))}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-lg max-w-lg leading-relaxed mb-8 border-l-4 border-emerald-500 pl-4">
            {slides[currentIndex].subtitle}
            </p>

            <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(slides[currentIndex].link)}
            className="px-8 py-3.5 bg-white text-emerald-800 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
            >
            {slides[currentIndex].btnText}
            {/* Animated Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
            </motion.button>
        </motion.div>
      </div>

      {/* --- Slide Indicators (Dots) --- */}
      <div className="absolute bottom-8 left-6 sm:left-16 flex gap-3 z-20">
        {slides.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentIndex ? "w-10 bg-emerald-500" : "w-2 bg-gray-500 hover:bg-white"
                }`}
            />
        ))}
      </div>

    </div>
  );
};

export default Hero;