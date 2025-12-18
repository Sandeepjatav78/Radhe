import React, { useState } from 'react';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser'; 

const RequestMedicine = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  // 👇 CLOUDINARY DETAILS (Ye sahi hain)
  const cloud_name = "drld9vkhw"; 
  const upload_preset = "radhePharmacy"; 

  // 👇 EMAILJS DETAILS (Updated with your keys)
  const service_id = "service_ttsesrx";          // ✅ Added
  const public_key = "aogcGcyRQpWF1oqRU";        // ✅ Added
  
  // ⚠️ YAHAN REAL TEMPLATE IDs DAALNI HAIN (Example: template_x9sk3j)
  const template_id_admin = "template_jnd3gnn"; 
  const template_id_user = "template_ezylsi4";   

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.target);
    const userName = formData.get("name");
    const userPhone = formData.get("phone");
    const userEmail = formData.get("email"); 
    const medicineName = formData.get("medicine_name");

    let prescriptionUrl = "No Image Uploaded";

    // 1. Upload Image to Cloudinary
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
                prescriptionUrl = cloudinaryData.secure_url;
            }
        } catch (error) {
            toast.error("Image upload failed");
            setIsSubmitting(false);
            return;
        }
    }

    // 2. Prepare Email Data
    const templateParams = {
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        medicine_name: medicineName,
        prescription_link: prescriptionUrl,
    };

    try {
        // --- MAIL 1: Send to Admin (Aapko) ---
        await emailjs.send(service_id, template_id_admin, templateParams, public_key);

        // --- MAIL 2: Send Auto-Reply to User (Customer ko) ---
        await emailjs.send(service_id, template_id_user, templateParams, public_key);

        toast.success("Request Sent! Check your email for confirmation.");
        event.target.reset();
        setFile(null);

    } catch (error) {
        console.error("EmailJS Error:", error);
        toast.error("Failed to send request. Check Template IDs.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-orange-50/50 border border-orange-200 rounded-xl text-center shadow-sm">
      <p className="text-2xl mb-2">💊</p>
      <h3 className="text-xl font-bold text-gray-800">Did not find your medicine?</h3>
      <p className="text-gray-500 text-sm mb-6">Don't worry! Upload a photo or type the name, and we will arrange it for you.</p>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 text-left">
        
        <input required name="name" type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-emerald-500 text-sm" />
        <input required name="email" type="email" placeholder="Your Email (For Confirmation)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-emerald-500 text-sm" />
        <input required name="phone" type="number" placeholder="Phone Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-emerald-500 text-sm" />
        
        <input name="medicine_name" type="text" placeholder="Medicine Name (e.g. Dolo 650)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-emerald-500 text-sm" />
        
        {/* File Input */}
        <div className="relative border border-dashed border-gray-400 rounded-lg p-3 bg-white text-center cursor-pointer hover:bg-gray-50">
            <p className="text-xs text-gray-500">{file ? `Selected: ${file.name}` : "Click to Upload Prescription/Photo"}</p>
            <input 
                type="file" 
                name="attachment" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all text-sm disabled:bg-gray-400">
            {isSubmitting ? "Sending Request..." : "Request Medicine"}
        </button>

      </form>
    </div>
  );
};

export default RequestMedicine;