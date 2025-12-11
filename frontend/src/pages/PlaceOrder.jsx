import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import LocationPicker from "../components/LocationPicker";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, delivery_fee, products } =
    useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isRxRequired, setIsRxRequired] = useState(false);
  
  // --- STATE FOR COORDINATES ---
  const [coordinates, setCoordinates] = useState(null); 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    let items = [];
    if (location.state && location.state.product) {
      const { product } = location.state;
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        packSize: product.packSize,
        quantity: 1,
        prescriptionRequired: product.prescriptionRequired,
      });
    } else {
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
    }
    setOrderItems(items);

    const needsRx = items.some((item) => item.prescriptionRequired === true);
    setIsRxRequired(needsRx);
  }, [location.state, cartItems, products]);

  const onChangeHandler = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // --- Payment Functions (Razorpay Logic Commented Out via switch case below) ---
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

    if (orderItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (isRxRequired && !prescriptionFile) {
      toast.error("Please upload doctor's prescription.", { autoClose: 3000 });
      window.scrollTo(0, 0); 
      return;
    }

    // --- MAP LOCATION CHECK ---
    if (!coordinates) {
        toast.error("Please detect or select delivery location on the map.");
        return;
    }

    try {
      const amount =
        orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
        delivery_fee;

      const finalAddress = {
          ...formData,
          lat: coordinates.lat,
          lng: coordinates.lng
      };

      const orderData = {
        address: finalAddress, 
        items: orderItems,
        amount: amount,
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

        // --- RAZORPAY CASE (CHANGED) ---
        case "razorpay":
          toast.info("Razorpay Payment Coming Soon!");
          
          /* // Original Code Commented Out
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
           toast.info("Razorpay Payment Coming Soon!");
          // Stripe Logic also commented out if you only want COD active for now
          // or keep it if stripe works. Assuming you want to keep stripe active:
          // const responseStripe = await axios.post(
          //   backendUrl + "/api/order/stripe",
          //   orderData,
          //   { headers: { token } }
          // );
          // if (responseStripe.data.success)
          //   window.location.replace(responseStripe.data.session_url);
          // else toast.error(responseStripe.data.message);
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col lg:flex-row gap-8 min-h-[80vh] px-4 sm:px-8 pt-10 border-t"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <Title text1="DELIVERY" text2="INFORMATION" />

        {/* --- MAP SECTION --- */}
        <LocationPicker setLocation={setCoordinates} />

        <div className="flex gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
        </div>
        <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="Email Address" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />
        <input required name="street" value={formData.street} onChange={onChangeHandler} type="text" placeholder="Street Address" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />

        <div className="flex gap-3">
          <input required name="city" value={formData.city} onChange={onChangeHandler} type="text" placeholder="City" className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
          <input required name="state" value={formData.state} onChange={onChangeHandler} type="text" placeholder="State" className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
        </div>
        <div className="flex gap-3">
          <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} type="number" placeholder="Zipcode" className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
          <input required name="country" value={formData.country} onChange={onChangeHandler} type="text" placeholder="Country" className="flex-1 border border-gray-300 rounded px-3.5 py-2.5 outline-emerald-500" />
        </div>
        <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="number" placeholder="Phone Number" className="border border-gray-300 rounded px-3.5 py-2.5 w-full outline-emerald-500" />
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6">
        <CartTotal />

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

        <div className="mt-2">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex flex-col lg:flex-row gap-4 mt-3">
            <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "stripe" ? "border-emerald-500 bg-emerald-50" : ""}`}>
               <p className="font-medium ml-2">Stripe</p>
            </div>
            <div onClick={() => setMethod("razorpay")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "razorpay" ? "border-emerald-500 bg-emerald-50" : ""}`}>
               <p className="font-medium ml-2">Razorpay</p>
            </div>
            <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 p-3 border cursor-pointer rounded-lg ${method === "cod" ? "border-emerald-500 bg-emerald-50" : ""}`}>
               <p className="font-medium ml-2">Cash on Delivery</p>
            </div>
          </div>

          <button type="submit" className="mt-8 w-full cursor-pointer bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg shadow-lg">
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;