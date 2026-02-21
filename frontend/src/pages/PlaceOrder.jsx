import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, products, currency } = useContext(ShopContext);
  const { getToken } = useAuth();

  const [method, setMethod] = useState("cod");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [deliverySlot, setDeliverySlot] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false); 

  const CLOUD_NAME = "drld9vkhw"; 
  const UPLOAD_PRESET = "radhePharmacy"; 

  const TIME_SLOTS = [
    "06:30 AM - 08:00 AM",
    "09:00 AM - 10:30 AM",
    "12:30 PM - 02:00 PM",
    "03:30 PM - 05:00 PM",
    "06:00 PM - 07:30 PM",
    "09:30 PM - 11:00 PM",
  ];

  // Get Data from Cart Page
  const { address, coordinates, deliveryFee, distance, couponCode, couponDiscount } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: address?.street || "", city: address?.city || "",
    state: address?.state || "", zipcode: address?.zipcode || "", country: "India",
  });

  const cartTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalAmount = Math.max(0, cartTotal + (deliveryFee || 0) - (couponDiscount || 0));
  const isRxRequired = orderItems.some(item => item.prescriptionRequired);

  useEffect(() => {
    if (!location.state) {
        navigate('/cart');
        return;
    }

    const items = [];
    for (const itemId in cartItems) {
        const product = products.find((p) => p._id === itemId);
        if (product) {
            const sizes = cartItems[itemId];
            for (const size in sizes) {
                if (sizes[size] > 0) {
                    let itemPrice = product.price;
                    if (product.variants && product.variants.length > 0) {
                         const variant = product.variants.find(v => v.size === size);
                         if (variant) itemPrice = variant.price;
                    }
                    items.push({
                        productId: product._id,
                        name: product.name,
                        price: itemPrice,
                        image: product.image,
                        size: size,
                        quantity: sizes[size],
                        prescriptionRequired: product.prescriptionRequired,
                    });
                }
            }
        }
    }
    setOrderItems(items);
  }, [cartItems, products, location.state, navigate]);

  const onChangeHandler = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isRxRequired && !prescriptionFile) {
      toast.error("Please upload doctor's prescription.");
      return;
    }
    if (!deliverySlot) {
        toast.error("Please select a preferred Delivery Time Slot.");
        return;
    }

    setIsUploading(true); 

    try {
      let prescriptionUrl = "";

      if (isRxRequired && prescriptionFile) {
          const imageFormData = new FormData();
          imageFormData.append("file", prescriptionFile);
          imageFormData.append("upload_preset", UPLOAD_PRESET);

          const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
              method: "POST",
              body: imageFormData
          });
          const cloudData = await cloudRes.json();

          if (cloudData.secure_url) {
              prescriptionUrl = cloudData.secure_url;
          } else {
              toast.error("Image upload failed. Try again.");
              setIsUploading(false);
              return;
          }
      }

      const orderData = {
        address: {
            ...formData,
            lat: coordinates?.lat,
            lng: coordinates?.lng
        }, 
        items: orderItems,
        amount: finalAmount,
        deliveryFee: deliveryFee || 0,
        couponCode: couponCode || null,
        couponDiscount: couponDiscount || 0,
        prescriptionUploaded: isRxRequired ? true : false, 
        prescriptionUrl: prescriptionUrl, 
        slot: deliverySlot, 
        date: Date.now()
      };

      const freshToken = await getToken?.();
      const authToken = freshToken || token;

      if (!authToken) {
        toast.error("Please login to place the order.");
        navigate("/login");
        return;
      }

      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          if (response.data.success) {
            toast.success("Order Placed Successfully!");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "razorpay":
          toast.info("Razorpay Payment Coming Soon!");
          break;

        case "stripe":
            toast.info("Stripe Payment Coming Soon!");
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
        setIsUploading(false); 
    }
  };

  return (
    // ✅ MOBILE FIX: Reduced top-padding (pt-6) and gap for mobile. Added pb-24 so bottom-nav doesn't block.
    <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-6 sm:gap-8 min-h-[80vh] px-4 sm:px-8 pt-6 sm:pt-10 mb-24 sm:mb-20 max-w-7xl mx-auto">
      
      {/* ================= LEFT: DELIVERY INFO ================= */}
      <div className="flex flex-col gap-5 sm:gap-6 w-full lg:w-1/2">
        <Title text1="DELIVERY" text2="INFORMATION" />
        
        {/* ✅ MOBILE FIX: Inputs text-sm so iOS keyboard doesn't auto-zoom. */}
        <div className="grid grid-cols-2 gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 outline-emerald-500" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 outline-emerald-500" />
        </div>
        <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="Email Address" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full outline-emerald-500" />
        <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="number" placeholder="Phone Number" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full outline-emerald-500" />
        
        <div className="mt-2 sm:mt-4">
              <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">Address (Detected from Map)</p>
              <input required name="street" value={formData.street} onChange={onChangeHandler} type="text" placeholder="Street Address" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full mb-3 bg-white" />
                  <div className="grid grid-cols-2 gap-3">
                 <input required name="city" value={formData.city} onChange={onChangeHandler} type="text" placeholder="City" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full bg-white" />
                 <input required name="state" value={formData.state} onChange={onChangeHandler} type="text" placeholder="State" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full bg-white" />
              </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                 <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} type="number" placeholder="Zipcode" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full bg-white" />
                 <input name="country" value={formData.country} readOnly type="text" placeholder="Country" className="text-sm border border-gray-300 rounded-lg px-3.5 py-3 w-full bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
        </div>

        {/* --- Delivery Time Slot --- */}
        <div className="mt-4 sm:mt-6">
            <h3 className="text-gray-800 font-bold mb-3 sm:mb-4 text-base sm:text-lg">Preferred Delivery Time <span className="text-red-500">*</span></h3>
            {/* ✅ MOBILE FIX: 2 Columns on mobile so it takes up less vertical space. Smaller text. */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                {TIME_SLOTS.map((slot, index) => (
                    <div 
                        key={index}
                        onClick={() => setDeliverySlot(slot)}
                        className={`border rounded-lg p-2.5 sm:p-3 cursor-pointer text-center transition-all duration-200 text-[11px] sm:text-sm ${
                            deliverySlot === slot 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500' 
                            : 'border-gray-200 hover:border-emerald-300 text-gray-600 font-medium'
                        }`}
                    >
                        {slot}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* ================= RIGHT: SUMMARY & PAYMENT ================= */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6">
        
        {/* Rx Upload */}
        {isRxRequired && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="text-xl sm:text-2xl">⚠️</span>
              <h3 className="text-red-700 font-bold text-base sm:text-lg">Prescription Required</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Upload doctor's prescription image to proceed.
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="rx-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
                {prescriptionFile ? "Change File" : "Choose File"}
              </label>
              <input id="rx-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setPrescriptionFile(e.target.files[0])} />
              <span className="text-xs text-gray-500 italic max-w-[150px] truncate">{prescriptionFile ? prescriptionFile.name : "No file chosen"}</span>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm lg:sticky lg:top-20">
              <Title text1="ORDER" text2="TOTAL" />
              <div className="flex flex-col gap-2.5 mt-4 text-sm text-gray-600">
                 <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currency}{cartTotal}.00</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Delivery Fee ({distance?.toFixed(1) || 0}km)</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>
                        {deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee}.00`}
                    </span>
                 </div>
                 {couponDiscount > 0 && (
                   <>
                     <div className="flex justify-between text-green-600">
                       <span className="flex items-center gap-1">
                         <span>🎉</span>
                         <span>Coupon ({couponCode})</span>
                       </span>
                       <span className="font-semibold">-{currency}{couponDiscount}.00</span>
                     </div>
                     <div className="bg-green-50 border border-green-200 px-2 py-1 rounded text-xs text-green-700 text-center">
                       You saved {currency}{couponDiscount} with promo code!
                     </div>
                   </>
                 )}
                 <hr className="border-gray-100 my-2" />
                 <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>{currency}{finalAmount}.00</span>
                 </div>
              </div>

              <div className="mt-8">
                <Title text1="PAYMENT" text2="METHOD" />
                <div className="flex flex-col gap-3 mt-4">
                    {/* ✅ MOBILE FIX: Taller payment boxes (p-3.5) for easier thumb tapping. */}
                    <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 p-3.5 sm:p-3 border cursor-pointer rounded-xl ${method === "stripe" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${method === "stripe" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">Stripe / Credit Card</p>
                    </div>
                    <div onClick={() => setMethod("razorpay")} className={`flex items-center gap-3 p-3.5 sm:p-3 border cursor-pointer rounded-xl ${method === "razorpay" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${method === "razorpay" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">Razorpay / UPI</p>
                    </div>
                    <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 p-3.5 sm:p-3 border cursor-pointer rounded-xl ${method === "cod" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${method === "cod" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">Cash on Delivery</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isUploading}
                    className="mt-8 w-full cursor-pointer bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition-colors font-bold text-base sm:text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] disabled:bg-gray-400"
                >
                    {isUploading ? "Processing..." : "PLACE ORDER"}
                </button>
             </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;