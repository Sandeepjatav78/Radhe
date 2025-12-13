import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900">Get in <span className="text-emerald-700">Touch</span></h2>
        <p className="text-gray-500 mt-2">We are here to help you with your medicines and health queries.</p>
      </div>

      {/* --- INFO CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        
        {/* Card 1: Phone */}
        <div className="bg-emerald-50/50 p-8 rounded-2xl text-center border border-emerald-100 hover:shadow-md transition group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl group-hover:scale-110 transition-transform">
            📞
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
          <p className="text-gray-600 text-sm font-medium">98175-00669</p>
          <p className="text-gray-600 text-sm font-medium">82783-57882</p>
          <p className="text-gray-400 text-xs mt-2">Available 6:00 AM - 10:00 PM</p>
        </div>

        {/* Card 2: Email */}
        <div className="bg-blue-50/50 p-8 rounded-2xl text-center border border-blue-100 hover:shadow-md transition group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl group-hover:scale-110 transition-transform">
            📧
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
          <p className="text-gray-600 text-sm break-all">radhepharmacy099@gmail.com</p>
          <p className="text-gray-400 text-xs mt-2">We reply within 24 hours</p>
        </div>

        {/* Card 3: Location */}
        <div className="bg-orange-50/50 p-8 rounded-2xl text-center border border-orange-100 hover:shadow-md transition group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl group-hover:scale-110 transition-transform">
            📍
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Visit Store</h3>
          <p className="text-gray-600 text-sm">Hari Singh Chowk,</p>
          <p className="text-gray-600 text-sm">Devi Mandir Road,</p>
          <p className="text-gray-600 text-sm">Panipat, Haryana - 132103</p>
        </div>
      </div>

      {/* --- SPLIT SECTION: IMAGE & FORM --- */}
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Left: Image */}
        <div className="w-full md:w-1/2">
            <img
            src={assets.contact_img}
            alt="Radhe Pharmacy Store"
            className="w-full h-[450px] rounded-2xl shadow-lg object-cover"
            />
        </div>

        {/* Right: Contact Form */}
        <div className="w-full md:w-1/2 bg-white p-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
            <p className="text-gray-500 text-sm mb-6">Got a question about a medicine or your order? Fill out the form below.</p>
            
            <form className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors" />
                    <input type="text" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors" />
                <textarea rows="4" placeholder="Your Message or Medicine Query..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors"></textarea>
                
                <button className="bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg">
                    Send Message
                </button>
            </form>
        </div>
      </div>

      {/* --- CAREERS SECTION (Bottom) --- */}
      <div className="mt-20 border-t border-gray-200 pt-10 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Team</h3>
          <p className="text-gray-500 mb-6">Are you a Pharmacist or Delivery Partner? We are hiring in Panipat.</p>
          <button className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all text-sm font-medium">
            Explore Careers
          </button>
      </div>

    </div>
  );
};

export default Contact;