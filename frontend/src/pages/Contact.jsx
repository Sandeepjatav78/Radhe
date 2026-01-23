import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Contact = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  // 👇 AAPKI CLOUDINARY DETAILS 👇
  const cloud_name = "drld9vkhw"; 
  const upload_preset = "radhePharmacy"; 

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    
    // --- STEP 1: UPLOAD IMAGE TO CLOUDINARY ---
    if (file) {
        const imageFormData = new FormData();
        imageFormData.append("file", file);
        imageFormData.append("upload_preset", upload_preset);

        try {
            const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: "POST",
                body: imageFormData
            });
            const cloudinaryData = await cloudinaryRes.json();
            
            if (cloudinaryData.secure_url) {
                formData.append("prescription_link", cloudinaryData.secure_url);
                formData.delete("attachment");
            } else {
                console.error("Cloudinary Error:", cloudinaryData);
                toast.error("Image upload failed. Check preset settings.");
                setIsSubmitting(false);
                return;
            }
        } catch (error) {
            console.error(error);
            toast.error("Image upload error");
            setIsSubmitting(false);
            return;
        }
    }

    // --- STEP 2: SEND EMAIL VIA WEB3FORMS ---
    formData.append("access_key", "5c5adeda-eb71-4642-9950-96ed3eaafea3"); 

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            toast.success("Message Sent Successfully!");
            event.target.reset();
            setFile(null);
        } else {
            toast.error("Error sending message. Try again.");
            console.log("Web3Forms Error", data);
        }
    } catch (error) {
        toast.error("Network Error");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900">Get in <span className="text-emerald-700">Touch</span></h2>
        <p className="text-gray-500 mt-2">We are here to help you with your medicines and health queries.</p>
      </div>

      {/* --- INFO CARDS (NOW CLICKABLE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* ✅ CLICKABLE: CALL US */}
        <a href="tel:+919817500669" className="bg-emerald-50/50 p-8 rounded-2xl text-center border border-emerald-100 hover:shadow-md hover:bg-emerald-100 transition group cursor-pointer block">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl group-hover:scale-110 transition-transform">📞</div>
          <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
          <p className="text-gray-600 text-sm font-medium">98175-00669,</p>
          <p className="text-gray-600 text-sm font-medium">82783-57882</p>
          <p className="text-gray-400 text-xs mt-2">Available 6:30 AM - 10:30 PM</p>
        </a>

        {/* ✅ CLICKABLE: EMAIL US */}
        <a href="mailto:radhepharmacy099@gmail.com" className="bg-blue-50/50 p-8 rounded-2xl text-center border border-blue-100 hover:shadow-md hover:bg-blue-100 transition group cursor-pointer block">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl group-hover:scale-110 transition-transform">📧</div>
          <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
          <p className="text-gray-600 text-sm break-all">radhepharmacy099@gmail.com</p>
          <p className="text-gray-400 text-xs mt-2">We reply within 24 hours</p>
        </a>

        {/* ✅ CLICKABLE: VISIT STORE (GOOGLE MAPS) */}
        <a href="https://maps.app.goo.gl/gDk7z8M4edSj9irh6" target="_blank" rel="noopener noreferrer" className="bg-orange-50/50 p-8 rounded-2xl text-center border border-orange-100 hover:shadow-md hover:bg-orange-100 transition group cursor-pointer block">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl group-hover:scale-110 transition-transform">📍</div>
          <h3 className="font-bold text-gray-900 mb-2">Visit Store</h3>
          <p className="text-gray-600 text-sm">Hari Singh Chowk, Devi Mandir Road,</p>
          <p className="text-gray-600 text-sm">Panipat, Haryana - 132103</p>
        </a>

      </div>

      {/* --- OPERATING HOURS & REGULATORY INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col justify-center">
              <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">🕒 Operating Hours</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                      <span className="font-semibold text-gray-700">All Days (Mon - Sun)</span>
                      <span className="font-bold text-emerald-700 text-base">6:30 AM - 10:30 PM</span>
                  </li>
              </ul>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">📜 Regulatory Information</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                      <span className="font-semibold min-w-[120px]">Drug Lic. No:</span>
                      <span>RLF20HR2025005933 & RLF21HR2025005925</span>
                  </li>
                  <li className="flex gap-2">
                      <span className="font-semibold min-w-[120px]">Pharmacist:</span>
                      <span>Poonam</span>
                  </li>
                  <li className="flex gap-2">
                      <span className="font-semibold min-w-[120px]">Reg. Number:</span>
                      <span>PMC/54321</span>
                  </li>
                  <li className="flex gap-2">
                      <span className="font-semibold min-w-[120px]">GSTIN:</span>
                      <span>06NNTPS0144E1ZL</span>
                  </li>
                  <li className="flex gap-2">
                      <span className="font-semibold min-w-[120px]">FSSAI Lic:</span>
                      <span>20826016000067</span>
                  </li>
              </ul>
          </div>
      </div>

      {/* --- FORM SECTION --- */}
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Left: Image */}
        <div className="w-full md:w-1/2">
            <img
            src={assets.contact_img}
            alt="Radhe Pharmacy Store"
            className="w-full h-[550px] rounded-2xl shadow-lg object-cover"
            />
        </div>

        {/* Right: Contact Form */}
        <div className="w-full md:w-1/2 bg-white p-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
            <p className="text-gray-500 text-sm mb-6">Got a question or need to send a prescription? Fill out the form below.</p>
            
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                
                <input type="hidden" name="subject" value="New Enquiry (with Prescription) from Website" />

                <div className="grid grid-cols-2 gap-4">
                    <input required name="name" type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors" />
                    <input required name="phone" type="number" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors" />
                </div>
                
                <input required name="email" type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors" />
                
                <textarea required name="message" rows="4" placeholder="Your Message or Medicine Query..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-emerald-500 focus:border-emerald-500 transition-colors"></textarea>
                
                {/* --- FILE UPLOAD SECTION --- */}
                <div className="border border-dashed border-gray-400 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Attach Prescription / Medicine Photo (Optional)</p>
                    <input 
                        type="file" 
                        name="attachment" 
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100
                        cursor-pointer"
                    />
                    {file && <p className="text-xs text-green-600 mt-2 font-bold">Selected: {file.name}</p>}
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg disabled:bg-gray-400 flex justify-center items-center gap-2"
                >
                    {isSubmitting ? (
                        <>Processing...</>
                    ) : (
                        <>Send Message</>
                    )}
                </button>
            </form>
        </div>
      </div>

      {/* --- CAREERS SECTION --- */}
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