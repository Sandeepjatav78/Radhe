import React from 'react';
import { assets } from '../assets/assets'; 

const About = () => {
  
  // ✅ CORRECTED LINK (Direct Streaming Link)
  // ID: 1eXG1MFLGhaBhMnf1OeW3MG5BA2QAWL3i
  const videoUrl = "https://res.cloudinary.com/drld9vkhw/video/upload/v1767439971/RP_ypedig.mp4";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-24">
        
        {/* Left: Video/Image with Styling */}
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <video
            src={videoUrl} 
            autoPlay
            loop
            muted
            playsInline
            className="relative w-full rounded-2xl shadow-2xl border border-gray-100 object-cover aspect-video"
          >
             {/* Agar video play na ho to ye message dikhega */}
             Your browser does not support the video tag.
          </video>
        </div>

        {/* ... Right Side Content (Same as before) ... */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
           <div>
              <p className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-2">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Empowering Health, <br/> One Prescription at a Time.
              </h2>
           </div>
           
           <p className="text-gray-600 leading-relaxed text-lg">
            Welcome to <span className="font-semibold text-gray-800">Radhe Pharmacy</span>. 
            Since our inception, we have been driven by a single purpose: to make genuine healthcare accessible to every household.
            We aren't just a pharmacy; we are your partners in wellness.
           </p>

           {/* Stats Row */}
           <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 mt-2">
              <div>
                 <h4 className="text-2xl font-bold text-gray-900">5k+</h4>
                 <p className="text-xs text-gray-500 mt-1">Happy Patients</p>
              </div>
              <div>
                 <h4 className="text-2xl font-bold text-gray-900">100%</h4>
                 <p className="text-xs text-gray-500 mt-1">Genuine Meds</p>
              </div>
              <div>
                 <h4 className="text-2xl font-bold text-gray-900">24/7</h4>
                 <p className="text-xs text-gray-500 mt-1">Support Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* ... Rest of the component ... */}
      <div className="mb-24 bg-gray-50 rounded-3xl p-8 md:p-16 text-center">
         <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
         <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
           "To bridge the gap between quality medication and affordability. We leverage technology 
           to ensure that no patient has to wait for critical medicines, delivering health safely to your doorstep."
         </p>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
            <p className="text-emerald-600 font-bold text-sm tracking-wide uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-gray-900">The Radhe Promise</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">100% Genuine</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
                We source directly from authorized manufacturers. No middlemen, no compromise on quality.
            </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
                Our optimized logistics network ensures your critical medicines reach you in record time.
            </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Expert Support</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
                Confused about a prescription? Our certified pharmacists are available 24/7 to guide you.
            </p>
            </div>

        </div>
       </div>

       <div className="text-center py-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Join Our Community</h2>
            <p className="text-gray-500 mb-6">Get health tips and exclusive offers directly to your inbox.</p>
            <div className="flex justify-center gap-2 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-emerald-500" />
                <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition">Subscribe</button>
            </div>
       </div>

    </div>
  );
};

export default About;