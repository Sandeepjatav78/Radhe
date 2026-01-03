import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* COLUMN 1: Brand & Regulatory Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start"
        >
          <h1 className="text-white text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-500">Radhe</span> Pharmacy
          </h1>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            Your trusted partner in health. 100% genuine medicines delivered directly to your home in Panipat.
          </p>

          {/* Regulatory Details */}
          <div className="text-xs text-gray-500 space-y-1 border-l-2 border-emerald-600 pl-3">
             <p><span className="text-gray-400 font-semibold">Drug Lic:</span> 20B/1234/24</p>
             <p><span className="text-gray-400 font-semibold">Pharmacist:</span> Mr. Rahul</p>
             <p><span className="text-gray-400 font-semibold">Reg. No:</span> PMC/54321</p>
             <p><span className="text-gray-400 font-semibold">GSTIN:</span> 06ABCDE1234F1Z5</p>
             <p><span className="text-gray-400 font-semibold">FSSAI:</span> 10821000000000</p>
          </div>
        </motion.div>

        {/* COLUMN 2: Company Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-white text-lg font-semibold mb-4">Company</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link to="/collection" className="hover:text-emerald-400 transition-colors">Order Medicine</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
          </ul>
        </motion.div>

        {/* ✅ COLUMN 3: LEGAL POLICIES (New Links) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-white text-lg font-semibold mb-4">Legal & Policy</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/return-policy" className="hover:text-emerald-400 transition-colors">Return & Refund</Link></li>
            <li><Link to="/cancellation-policy" className="hover:text-emerald-400 transition-colors">Cancellation Policy</Link></li>
            <li><Link to="/prescription-policy" className="hover:text-emerald-400 transition-colors">Prescription Policy</Link></li>
            <li><Link to="/grievance-redressal" className="hover:text-emerald-400 transition-colors">Grievance Officer</Link></li>
          </ul>
        </motion.div>

        {/* COLUMN 4: Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-white text-lg font-semibold mb-4">Contact</h2>
          <div className="text-sm text-gray-400 space-y-3 mb-4">
             <p>Hari Singh Chowk,<br/>Panipat - 132103</p>
             <p className="text-white font-medium">98175-00669</p>
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

      <div className="text-center text-xs text-gray-600 mt-10 border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} Radhe Pharmacy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;