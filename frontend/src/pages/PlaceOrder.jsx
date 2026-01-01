import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, products, currency } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [deliverySlot, setDeliverySlot] = useState(null);
  
  // ✅ NEW: Loading state for upload
  const [isUploading, setIsUploading] = useState(false); 

  // 👇 YOUR CLOUDINARY CONFIG (Same as Contact Page)
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
  const { address, coordinates, deliveryFee, distance } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: address?.street || "", city: address?.city || "",
    state: address?.state || "", zipcode: address?.zipcode || "", country: "India",
  });

  const cartTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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

  // --- SUBMIT HANDLER (Updated with Upload Logic) ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (isRxRequired && !prescriptionFile) {
      toast.error("Please upload doctor's prescription.");
      return;
    }
    if (!deliverySlot) {
        toast.error("Please select a preferred Delivery Time Slot.");
        return;
    }

    setIsUploading(true); // Start Loading Spinner

    try {
      let prescriptionUrl = "";

      // 2. Upload to Cloudinary (If file selected)
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
              console.log("Uploaded Rx URL:", prescriptionUrl);
          } else {
              toast.error("Image upload failed. Try again.");
              setIsUploading(false);
              return;
          }
      }

      // 3. Prepare Order Data
      const finalAmount = cartTotal + deliveryFee;

      const orderData = {
        address: {
            ...formData,
            lat: coordinates?.lat,
            lng: coordinates?.lng
        }, 
        items: orderItems,
        amount: finalAmount,
        prescriptionUploaded: isRxRequired ? true : false, 
        
        // 👇 SENDING THE URL TO BACKEND
        prescriptionUrl: prescriptionUrl, 
        
        slot: deliverySlot, 
        date: Date.now()
      };

      // 4. Send to Backend
      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
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
        setIsUploading(false); // Stop Loading
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-8 min-h-[80vh] px-4 sm:px-8 pt-10 border-t mb-20 max-w-7xl mx-auto">
      
      {/* --- Left Side: PERSONAL DETAILS --- */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <Title text1="DELIVERY" text2="INFORMATION" />
        
        <div className="grid grid-cols-2 gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" className="border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" className="border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
        </div>
        <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="Email Address" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />
        <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="number" placeholder="Phone Number" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />
        
        <div className="mt-4">
              <p className="text-sm font-bold text-gray-700 mb-2">Address (Detected from Map)</p>
              <input required name="street" value={formData.street} onChange={onChangeHandler} type="text" placeholder="Street Address" className="border border-gray-300 rounded px-3.5 py-2.5 w-full mb-3 bg-white" />
              <div className="grid grid-cols-2 gap-3">
                 <input required name="city" value={formData.city} onChange={onChangeHandler} type="text" placeholder="City" className="border border-gray-300 rounded px-3.5 py-2.5 w-full bg-white" />
                 <input required name="state" value={formData.state} onChange={onChangeHandler} type="text" placeholder="State" className="border border-gray-300 rounded px-3.5 py-2.5 w-full bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                 <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} type="number" placeholder="Zipcode" className="border border-gray-300 rounded px-3.5 py-2.5 w-full bg-white" />
                 <input name="country" value={formData.country} readOnly type="text" placeholder="Country" className="border border-gray-300 rounded px-3.5 py-2.5 w-full bg-gray-50 text-gray-500" />
              </div>
        </div>

        {/* --- Delivery Time Slot --- */}
        <div className="mt-6">
            <h3 className="text-gray-800 font-bold mb-4 text-lg">Preferred Delivery Time <span className="text-red-500">*</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot, index) => (
                    <div 
                        key={index}
                        onClick={() => setDeliverySlot(slot)}
                        className={`border rounded-lg p-3 cursor-pointer text-center transition-all duration-200 text-sm ${
                            deliverySlot === slot 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500' 
                            : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                        }`}
                    >
                        {slot}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- Right Side: SUMMARY & PAYMENT --- */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6">
        
        {/* Rx Upload */}
        {isRxRequired && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-red-700 font-bold text-lg">Prescription Required</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload doctor's prescription image.
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="rx-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">
                {prescriptionFile ? "Change File" : "Choose File"}
              </label>
              <input id="rx-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setPrescriptionFile(e.target.files[0])} />
              <span className="text-sm text-gray-500 italic">{prescriptionFile ? prescriptionFile.name : "No file chosen"}</span>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-20">
              <Title text1="ORDER" text2="TOTAL" />
              <div className="flex flex-col gap-3 mt-4 text-sm text-gray-600">
                 <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currency}{cartTotal}.00</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Delivery Fee ({distance}km)</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>
                        {deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee}.00`}
                    </span>
                 </div>
                 <hr className="border-gray-100 my-2" />
                 <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>{currency}{cartTotal + deliveryFee}.00</span>
                 </div>
              </div>

              <div className="mt-8">
                <Title text1="PAYMENT" text2="METHOD" />
                <div className="flex flex-col gap-3 mt-3">
                    {/* Payment Options (Stripe/Razorpay/COD) */}
                    <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "stripe" ? "border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full border ${method === "stripe" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-medium ml-2">Stripe</p>
                    </div>
                    <div onClick={() => setMethod("razorpay")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "razorpay" ? "border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full border ${method === "razorpay" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-medium ml-2">Razorpay</p>
                    </div>
                    <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "cod" ? "border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full border ${method === "cod" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-medium ml-2">Cash on Delivery</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isUploading}
                    className="mt-8 w-full cursor-pointer bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg shadow-lg disabled:bg-gray-400"
                >
                    {isUploading ? "Uploading & Placing Order..." : "PLACE ORDER"}
                </button>
             </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;