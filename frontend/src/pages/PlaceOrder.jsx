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

  // --- States ---
  const [method, setMethod] = useState("cod");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  
  // --- Get Data from Cart Page ---
  const { address, coordinates, deliveryFee, distance } = location.state || {};
  
  // --- Form State (Address Pre-filled from Cart) ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    zipcode: address?.zipcode || "",
    country: "India",
  });

  // Calculate Cart Subtotal
  const cartTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isRxRequired = orderItems.some(item => item.prescriptionRequired);

  useEffect(() => {
    // Agar Cart se data nahi aaya (Direct access), wapas bhejo
    if (!location.state) {
        navigate('/cart');
        return;
    }

    const items = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = products.find((p) => p._id === itemId);
        if (product) {
          items.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            packSize: product.packSize,
            quantity: cartItems[itemId],
            prescriptionRequired: product.prescriptionRequired,
          });
        }
      }
    }
    setOrderItems(items);
  }, [cartItems, products, location.state, navigate]);

  const onChangeHandler = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // --- Payment Functions (Kept your logic) ---
  const initPay = (order, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Radhe Pharmacy",
      description: "Medicine Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (PaymentResponse) => {
        try {
          const verifyResponse = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            { ...PaymentResponse, ...orderData },
            { headers: { token } }
          );
          if (verifyResponse.data.success) {
            toast.success("Order Placed Successfully!");
            setCartItems({});
            navigate("/orders");
          }
        } catch (error) {
          toast.error("Payment Verification Failed");
        }
      },
    };
    new window.Razorpay(options).open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isRxRequired && !prescriptionFile) {
      toast.error("Please upload doctor's prescription.");
      return;
    }

    try {
      const finalAmount = cartTotal + deliveryFee;

      const finalAddress = {
          ...formData,
          lat: coordinates?.lat,
          lng: coordinates?.lng
      };

      const orderData = {
        address: finalAddress, 
        items: orderItems,
        amount: finalAmount,
        prescriptionUploaded: isRxRequired ? true : false,
      };

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
          } else toast.error(response.data.message);
          break;

        case "razorpay":
          toast.info("Razorpay Payment Coming Soon!");
          // Your existing commented code logic remains here...
          /*
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success)
            initPay(responseRazorpay.data.order, orderData);
          else toast.error("Razorpay Failed");
          */
          break;

        case "stripe":
            toast.info("Stripe Payment Coming Soon!");
            // Your existing commented code logic...
            /*
            const responseStripe = await axios.post(
             backendUrl + "/api/order/stripe",
             orderData,
             { headers: { token } }
            );
            if (responseStripe.data.success)
             window.location.replace(responseStripe.data.session_url);
            else toast.error(responseStripe.data.message);
            */
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-8 min-h-[80vh] px-4 sm:px-8 pt-10 border-t mb-20 max-w-7xl mx-auto">
      
      {/* --- Left Side: PERSONAL DETAILS --- */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <Title text1="DELIVERY" text2="INFORMATION" />
        
        {/* Name & Contact */}
        <div className="grid grid-cols-2 gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" className="border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" className="border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
        </div>
        <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="Email Address" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />
        <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="number" placeholder="Phone Number" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />
        
        {/* Address (Pre-filled but Editable) */}
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
                    {/* Stripe */}
                    <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "stripe" ? "border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full border ${method === "stripe" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-medium ml-2">Stripe</p>
                    </div>
                    {/* Razorpay */}
                    <div onClick={() => setMethod("razorpay")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "razorpay" ? "border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full border ${method === "razorpay" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-medium ml-2">Razorpay</p>
                    </div>
                    {/* COD */}
                    <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "cod" ? "border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full border ${method === "cod" ? "bg-emerald-500 border-emerald-500" : "border-gray-400"}`}></div>
                        <p className="font-medium ml-2">Cash on Delivery</p>
                    </div>
                </div>

                <button type="submit" className="mt-8 w-full cursor-pointer bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg shadow-lg">
                    PLACE ORDER
                </button>
             </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;