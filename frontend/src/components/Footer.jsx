import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 md:py-12 mt-16 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-5 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
        
        {/* 1. Brand & Description & LICENSE INFO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <h1 className="text-white text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-500">Radhe</span> Pharmacy
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-gray-400 mb-6">
            Your trusted partner in health. 100% genuine medicines delivered directly to your home in Panipat.
          </p>

          {/* ✅ MANDATORY REGULATORY DETAILS (Updated with GST & FSSAI) */}
          <div className="text-xs text-gray-500 space-y-1 border-l-2 border-emerald-600 pl-3 text-left">
             <p><span className="text-gray-400 font-semibold">Drug Lic. No:</span> 20B/1234/24 & 21B/1235/24</p>
             <p><span className="text-gray-400 font-semibold">Pharmacist:</span> Mr. Rahul Sharma</p>
             <p><span className="text-gray-400 font-semibold">Reg. No:</span> PMC/54321</p>
             {/* 👇 NEW ADDITIONS 👇 */}
             <p><span className="text-gray-400 font-semibold">GSTIN:</span> 06ABCDE1234F1Z5</p>
             <p><span className="text-gray-400 font-semibold">FSSAI Lic:</span> 10821000000000</p>
          </div>
        </motion.div>

        {/* 2. Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1"
        >
          <h2 className="text-white text-base md:text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link to="/collection" className="hover:text-emerald-400 transition-colors">Medicines</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </motion.div>

        {/* 3. Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1"
        >
          <h2 className="text-white text-base md:text-lg font-semibold mb-3">Get In Touch</h2>
          
          <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-3">
             <div className="flex flex-col">
                <p className="font-medium text-white mb-0.5">Address</p>
                <p className="leading-tight">Hari Singh Chowk,<br/>Panipat - 132103</p>
             </div>
             
             <div className="flex flex-col">
                <p className="font-medium text-white mb-0.5">Call Us</p>
                <p>98175-00669</p>
             </div>
          </div>

          <div className="flex space-x-3">
            {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                className="p-1.5 bg-gray-800 rounded-full hover:bg-emerald-600 hover:text-white transition-colors text-xs"
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="text-center text-[10px] sm:text-xs text-gray-600 mt-8 border-t border-gray-800 pt-6 px-4">
        © {new Date().getFullYear()} Radhe Pharmacy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;