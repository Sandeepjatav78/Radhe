import React from 'react';
import { assets } from '../assets/assets'; 
// Note: Agar video nahi hai to image use kar sakte hain, abhi ke liye video rakha hai
import video from '../assets/video.mp4'; 

const About = () => {
  return (
    <div className="px-6 sm:px-12 lg:px-24 py-16 bg-white font-sans">
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
        {/* Video or Image */}
        <video
          src={video}
          autoPlay
          loop
          muted
          controls
          className="w-full lg:w-[500px] rounded-lg shadow-lg"
        />
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-emerald-800">About Radhe Pharmacy</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Welcome to Radhe Pharmacy, your trusted partner in health and wellness. 
            Since our inception, we have been committed to providing 100% genuine medicines 
            and healthcare products directly from top manufacturers.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
             We understand that health cannot wait. That's why we focus on speed, authenticity, 
             and availability. Whether it's a critical prescription medicine or a daily vitamin supplement, 
             we ensure it reaches your doorstep safely.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            To make healthcare accessible and affordable for everyone. We aim to bridge the gap 
            between patients and quality medication through technology and compassionate service.
          </p>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-semibold mb-12 text-gray-800">
          Why <span className="text-emerald-700">Choose Us</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex-1 min-w-[250px] max-w-[300px] p-8 bg-emerald-50/50 border border-emerald-100 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <h4 className="text-xl font-semibold mb-3 text-gray-900">100% Genuine Medicines</h4>
            <p className="text-gray-600 leading-relaxed">
              We source directly from licensed manufacturers to ensure zero compromise on quality.
            </p>
          </div>
          <div className="flex-1 min-w-[250px] max-w-[300px] p-8 bg-emerald-50/50 border border-emerald-100 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <h4 className="text-xl font-semibold mb-3 text-gray-900">Fast Delivery</h4>
            <p className="text-gray-600 leading-relaxed">
              We know medicines are urgent. Our logistics team works round the clock to deliver on time.
            </p>
          </div>
          <div className="flex-1 min-w-[250px] max-w-[300px] p-8 bg-emerald-50/50 border border-emerald-100 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <h4 className="text-xl font-semibold mb-3 text-gray-900">
              Pharmacist Support
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Have a doubt about a dosage? Our qualified pharmacists are just a call away to assist you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;