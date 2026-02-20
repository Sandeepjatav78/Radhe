import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react"; // ✅ Import useAuth to get fresh token
import { ShopContext } from "../context/ShopContext";
import { FaEdit, FaCamera, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { clearAllCache } from "../utils/cacheUtils";
import "./Profile.css";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dt9g6lw4r/upload"; // Your Cloudinary cloud name
const UPLOAD_PRESET = "unsigned_preset_here"; // Replace with your unsigned upload preset name

const Profile = () => {
  const { backendUrl } = useContext(ShopContext);
  const { getToken } = useAuth(); // ✅ Get fresh token from Clerk for each request
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize on component mount - wait for token to be loaded from localStorage
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isInitializing) return;
      
      try {
        const freshToken = await getToken();
        
        if (!freshToken) {
          setLoading(false);
          toast.info("Please login to view your profile");
          navigate('/login');
          return;
        }
        
        const response = await axios.get(
          `${backendUrl}/api/user/profile`,
          { headers: { Authorization: `Bearer ${freshToken}` } } // ✅ Use fresh token
        );

        if (response.data.success) {
          const fetchedUser = response.data.user;
          setUser(fetchedUser);
          setFormData({
            name: fetchedUser.name || "",
            email: fetchedUser.email || "",
            phone: fetchedUser.phone || "",
            nationality: fetchedUser.nationality || "",
            location: fetchedUser.location || {
              city: "",
              state: "",
              country: "",
            },
          });
          setProfileImage(fetchedUser.profilePicture || null);

          localStorage.setItem("profileData", JSON.stringify(fetchedUser));
        } else {
          toast.error(response.data.message);
          const localProfile = localStorage.getItem("profileData");
          if (localProfile) {
            const data = JSON.parse(localProfile);
            setUser(data);
            setFormData(data);
            setProfileImage(data.profilePicture || null);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch profile data: " + (error.response?.data?.message || error.message));
        const localProfile = localStorage.getItem("profileData");
        if (localProfile) {
          const data = JSON.parse(localProfile);
          setUser(data);
          setFormData(data);
          setProfileImage(data.profilePicture || null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isInitializing, getToken, backendUrl, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (["city", "state", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formDataCloud,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProfileImage(data.secure_url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Cloudinary upload error", error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    const updatedProfile = {
      userId: user._id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nationality: formData.nationality,
      location: formData.location,
      profilePicture: profileImage,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setUser(response.data.user);
        setIsEditing(false);
        localStorage.setItem("profileData", JSON.stringify(response.data.user));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  
  if (!user) return null; // Will redirect in useEffect

  return (
    <div className="profile-page min-h-screen bg-gray-50 pb-20 sm:pb-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 border-white/30">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user.name || "Your Name"}</h1>
                <p className="text-emerald-100 text-sm sm:text-base">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-8">
            {/* User Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {/* Phone */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                    <p className="font-bold text-gray-900">{user.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      {user.location?.city || user.location?.state || user.location?.country
                        ? `${user.location.city || ""}${user.location.city && user.location.state ? ", " : ""}${user.location.state || ""}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nationality */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Nationality</p>
                    <p className="font-bold text-gray-900">{user.nationality || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div 
                onClick={() => navigate('/orders')}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 cursor-pointer hover:shadow-md transition-shadow active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">My Orders</p>
                    <p className="font-bold text-emerald-600 flex items-center gap-1">
                      View All
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                className="bg-emerald-600 text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
              
              <button
                className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 font-semibold transition-all active:scale-95 border border-gray-300"
                onClick={() => {
                  clearAllCache();
                  toast.success("Cache cleared! Refreshing...", { autoClose: 1500 });
                  setTimeout(() => window.location.reload(), 1600);
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Cache
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 sm:p-6 text-white flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <FaEdit /> Edit Profile
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      nationality: user.nationality || "",
                      location: user.location || { city: "", state: "", country: "" },
                    });
                  }}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg border-4 border-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <label className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-lg border-4 border-white">
                        <FaCamera className="text-white text-base sm:text-lg" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {uploading && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors bg-gray-50"
                        placeholder="your.email@example.com"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="e.g., Indian, American"
                      />
                    </div>

                    {/* Location Fields */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.location.city}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="Mumbai"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.location.state}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="Maharashtra"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.location.country}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="India"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          nationality: user.nationality || "",
                          location: user.location || { city: "", state: "", country: "" },
                        });
                      }}
                      className="px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
