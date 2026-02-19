import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const PrescriptionUpload = ({ orderId, onUploadSuccess }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset_here"); // Replace with your preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dt9g6lw4r/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        setPrescriptionImage(data.secure_url);
        toast.success("Prescription image uploaded!");
      } else {
        toast.error("Failed to upload prescription");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!prescriptionImage) {
      toast.warn("Please upload a prescription image");
      return;
    }

    if (!token) {
      toast.info("Please login to upload prescription");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/prescription/upload`,
        { orderId, prescriptionImage },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Prescription uploaded successfully");
        setPrescriptionImage(null);
        setPreview(null);
        onUploadSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading prescription");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📋</span> Upload Prescription
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Please upload a valid prescription for verification
      </p>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Prescription preview"
            className="max-h-64 rounded-lg border-2 border-orange-300"
          />
        </div>
      )}

      {/* Upload Area */}
      <label className="block p-6 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-100 transition mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="text-center">
          <div className="text-3xl mb-2">📷</div>
          <div className="font-bold text-gray-700">Click to upload or drag & drop</div>
          <div className="text-sm text-gray-600">PNG, JPG, or PDF (max 5MB)</div>
          {uploading && <div className="text-sm text-orange-600 mt-2">Uploading...</div>}
        </div>
      </label>

      {prescriptionImage && (
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-bold"
        >
          ✓ Submit Prescription
        </button>
      )}
    </div>
  );
};

export default PrescriptionUpload;
