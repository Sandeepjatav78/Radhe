import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // ✅ ADDED `pb-24 sm:pb-10` so the mobile bottom navbar doesn't cover the copyright text.
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-24 sm:pb-10 mt-12 md:mt-20 border-t border-gray-800 font-sans">
      
      {/* ✅ CHANGED GRID: Mobile uses 2 columns (grid-cols-2), Desktop uses 4 (md:grid-cols-4) */}
      <div className="container mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
        
        {/* COLUMN 1: Brand & Regulatory Info (Takes full width on mobile: col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="col-span-2 md:col-span-1 flex flex-col items-start"
        >
          <h1 className="text-white text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-500">Radhe</span> Pharmacy
          </h1>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed pr-4">
            Your trusted partner in health. 100% genuine medicines delivered directly to your home in Panipat.
          </p>

          {/* Regulatory Details */}
          <div className="text-[11px] sm:text-xs text-gray-500 space-y-1 border-l-2 border-emerald-600 pl-3">
             <p><span className="text-gray-400 font-semibold">Drug Lic:</span> RLF20HR2025005933 , RLF21HR2025005925</p>
             <p><span className="text-gray-400 font-semibold">Pharmacist:</span> Poonam</p>
             <p><span className="text-gray-400 font-semibold">Reg. No:</span> 56539</p>
             <p><span className="text-gray-400 font-semibold">GSTIN:</span> 06NNTPS0144E1ZL</p>
             <p><span className="text-gray-400 font-semibold">FSSAI:</span> 20826016000067</p>
          </div>
        </motion.div>

        {/* COLUMN 2: Company Links (Takes 1 column on mobile - sits left) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1"
        >
          <h2 className="text-white text-base sm:text-lg font-semibold mb-4">Company</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link to="/collection" className="hover:text-emerald-400 transition-colors">Order Medicine</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
          </ul>
        </motion.div>

        {/* COLUMN 3: LEGAL POLICIES (Takes 1 column on mobile - sits right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1"
        >
          <h2 className="text-white text-base sm:text-lg font-semibold mb-4">Legal & Policy</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
            <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-emerald-400 transition-colors">Terms of Use</Link></li>
            <li><Link to="/return-policy" className="hover:text-emerald-400 transition-colors">Refunds</Link></li>
            <li><Link to="/cancellation-policy" className="hover:text-emerald-400 transition-colors">Cancellation</Link></li>
            <li><Link to="/prescription-policy" className="hover:text-emerald-400 transition-colors">Rx Policy</Link></li>
            <li><Link to="/grievance-redressal" className="hover:text-emerald-400 transition-colors">Grievance</Link></li>
          </ul>
        </motion.div>

        {/* COLUMN 4: Contact Info (Takes full width on mobile: col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="col-span-2 md:col-span-1 pt-4 md:pt-0 border-t border-gray-800 md:border-none"
        >
          <h2 className="text-white text-base sm:text-lg font-semibold mb-4">Contact</h2>
          <div className="text-xs sm:text-sm text-gray-400 space-y-3 mb-5">
             <p>Hari Singh Chowk,<br/>Panipat - 132103</p>
             <p className="text-white font-medium text-base">98175-00669</p>
             <p>radhepharmacy099@gmail.com</p>
          </div>

          <div className="flex space-x-3">
            {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>

      <div className="text-center text-[10px] sm:text-xs text-gray-600 mt-10 border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} Radhe Pharmacy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;