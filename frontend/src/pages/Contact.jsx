import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="text-center pt-10 border-t">
       
       <div className='text-2xl font-bold mb-10'>
           <span className='text-gray-500'>CONTACT</span> <span className='text-emerald-700'>US</span>
       </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        {/* Left Side Image */}
        <img
          src={assets.contact_img}
          alt="Pharmacy Store"
          className="w-full md:max-w-[480px] rounded-lg shadow-md object-cover"
        />

        {/* Right Side Text */}
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Pharmacy</p>
          <p className="text-gray-500">
            Radhe Pharmacy <br /> 
            Shop No. 12, Main Market, <br />
            Model Town, Panipat - 132103
          </p>
          <p className="text-gray-500">
            Tel: (+91) 98765-43210 <br /> 
            Email: support@radhepharmacy.com
          </p>

          <p className="font-semibold text-xl text-gray-600">Careers at Radhe Pharmacy</p>
          <p className="text-gray-500">
            Looking for a job as a Pharmacist or Delivery Partner?
          </p>

          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;