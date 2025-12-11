import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-white text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-500">Radhe</span> Pharmacy
          </h1>
          <p className="text-sm leading-relaxed max-w-xs text-gray-400">
            Your trusted partner in health and wellness. We provide 100% genuine medicines, 
            healthcare essentials, and expert pharmacist support delivered to your doorstep.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-white text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors duration-200">Home</Link>
            </li>
            <li>
                <Link to="/collection" className="hover:text-emerald-400 transition-colors duration-200">Medicines</Link>
            </li>
            <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors duration-200">About Us</Link>
            </li>
            <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors duration-200">Contact</Link>
            </li>
          </ul>
        </motion.div>

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-white text-lg font-semibold mb-3">Get In Touch</h2>
          <div className="text-sm text-gray-400 mb-4 space-y-1">
             <p>Email: support@radhepharmacy.com</p>
             <p>Phone: +91 98765 43210</p>
          </div>

          <h3 className="text-white text-sm font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} Radhe Pharmacy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;