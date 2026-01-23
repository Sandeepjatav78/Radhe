import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1615461168478-f218222eb619?q=80&w=2070&auto=format&fit=crop", 
      tag: "NEW FEATURE",
      title: 'SCHEDULE YOUR DELIVERY',
      subtitle: 'Choose your preferred time slot (6 AM - 11 PM). We deliver exactly when you want.',
      btnText: 'Order Now',
      link: '/collection'
    },
    {
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop",
      tag: "100% TRUSTED",
      title: 'GENUINE MEDICINES ONLY',
      subtitle: 'Sourced from trusted and licensed distributors. No compromise on your health.',
      btnText: 'View Products',
      link: '/collection'
    },
    {
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
      tag: "COMING SOON",
      title: 'Rx UPLOAD SYSTEM',
      subtitle: 'We are engineering a secure, one-click prescription upload feature. A smarter way to order is on the horizon.',
      btnText: 'Explore Collection',
      link: '/collection' 
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
    // ✅ CHANGED: Mobile height is now a compact 320px instead of 60vh. Desktop remains 70vh.
    <div className="relative w-full mt-4 sm:mt-6 shadow-xl rounded-xl sm:rounded-2xl h-[320px] sm:h-[70vh] sm:min-h-[500px] overflow-hidden bg-gray-900 group">
      
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
            className="w-full h-full object-cover object-center"
          />
          {/* Darker gradient for mobile to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* --- Content Area --- */}
      <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-16 lg:px-24 z-10 max-w-3xl">
        <motion.div
            key={currentIndex + "-content"}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='text-left'
        >
            {/* Feature Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-block text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2 sm:mb-4 tracking-widest shadow-lg ${currentIndex === 2 ? 'bg-amber-500 shadow-amber-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}
            >
              {slides[currentIndex].tag}
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-tight drop-shadow-lg mb-2 sm:mb-4">
            {slides[currentIndex].title.split(" ").map((word, i) => (
                <span key={i} className={i === 0 ? "text-emerald-400" : "text-white"}>
                    {word}{" "}
                </span>
            ))}
            </h1>
            
            {/* ✅ Subtitle margin reduced for mobile to fit perfectly */}
            <p className="text-gray-200 text-xs sm:text-lg max-w-[280px] sm:max-w-lg leading-relaxed mb-4 sm:mb-8 border-l-2 sm:border-l-4 border-emerald-500 pl-3 sm:pl-4">
            {slides[currentIndex].subtitle}
            </p>

            {/* Button */}
            <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(slides[currentIndex].link)}
            className="text-sm sm:text-base px-5 py-2 sm:px-8 sm:py-3.5 bg-white text-emerald-800 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group w-max"
            >
            {slides[currentIndex].btnText}
            {/* Animated Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
            </motion.button>
        </motion.div>
      </div>

      {/* --- Slide Indicators (Dots) --- */}
      {/* ✅ Placed at bottom-4 for mobile to fit inside the 320px height */}
      <div className="absolute bottom-4 sm:bottom-8 left-5 sm:left-16 flex gap-2 sm:gap-3 z-20">
        {slides.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
                    index === currentIndex ? "w-8 sm:w-10 bg-emerald-500" : "w-2 bg-gray-500 hover:bg-white"
                }`}
            />
        ))}
      </div>

    </div>
  );
};

export default Hero;