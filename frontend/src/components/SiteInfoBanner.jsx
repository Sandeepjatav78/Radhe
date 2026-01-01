import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets'; // Ensure assets exist or use emoji

const SiteInfoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-emerald-50 border-b border-emerald-100 relative z-40"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            
            {/* --- Message Content --- */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs sm:text-sm font-medium text-emerald-800">
              
              {/* Feature 1 */}
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">1</span>
                <span>Select <strong>Delivery Time</strong> Slot</span>
              </div>

              <div className="hidden sm:block text-emerald-300">|</div>

              {/* Feature 2 */}
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">2</span>
                <span>Upload <strong>Doctor's Prescription</strong></span>
              </div>

              <div className="hidden sm:block text-emerald-300">|</div>

              {/* Feature 3 */}
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">3</span>
                <span>Get <strong>100% Genuine</strong> Meds</span>
              </div>

            </div>

            {/* --- Close Button --- */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-1 sm:static sm:ml-4 text-emerald-600 hover:text-emerald-900 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SiteInfoBanner;