import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LocationPicker from "../components/LocationPicker";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  
  // --- CALCULATION STATES ---
  const [coordinates, setCoordinates] = useState(null); 
  const [cartTotal, setCartTotal] = useState(0);        
  const [deliveryFee, setDeliveryFee] = useState(0);    
  const [distance, setDistance] = useState(0);          
  const [isDeliverable, setIsDeliverable] = useState(true);
  const [freeDeliveryMsg, setFreeDeliveryMsg] = useState("");
  
  // Address State
  const [detectedAddress, setDetectedAddress] = useState({
      street: "", city: "", state: "", zipcode: "", country: "India"
  });

  const STORE_COORDS = { lat: 29.3909, lng: 76.9635 }; // Panipat

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; 
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  useEffect(() => {
    let total = 0;
    const tempData = [];
    for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
           const product = products.find((p) => p._id === itemId);
           if (product) {
              tempData.push({ _id: itemId, quantity: cartItems[itemId] });
              total += product.price * cartItems[itemId];
           }
        }
    }
    setCartData(tempData);
    setCartTotal(total);

    if (coordinates) {
        const dist = getDistanceFromLatLonInKm(STORE_COORDS.lat, STORE_COORDS.lng, coordinates.lat, coordinates.lng);
        setDistance(dist);

        let fee = 0;
        let msg = "";
        let deliverable = true;

        if (dist > 20) {
            deliverable = false;
        } 
        else if (dist <= 2) {
            if (total > 150) fee = 0;
            else { fee = 20; msg = `Add items worth ${currency}${151 - total} more for FREE delivery!`; }
        } 
        else if (dist <= 5) {
            if (total > 250) fee = 0;
            else { fee = 40; msg = `Add items worth ${currency}${251 - total} more for FREE delivery!`; }
        } 
        else if (dist <= 10) {
            if (total > 450) fee = 0;
            else { fee = 70; msg = `Add items worth ${currency}${451 - total} more for FREE delivery!`; }
        } 
        else { 
            if (total > 550) fee = 0;
            else { fee = 100; msg = `Add items worth ${currency}${551 - total} more for FREE delivery!`; }
        }

        setDeliveryFee(fee);
        setFreeDeliveryMsg(fee === 0 ? "🎉 You have unlocked FREE Delivery!" : msg);
        setIsDeliverable(deliverable);
    }
  }, [cartItems, products, coordinates]);

  const handleAddressFromMap = (addressObj) => {
    setDetectedAddress(addressObj);
    toast.success("Address Updated!", {autoClose: 1000});
  };

  const handleProceed = () => {
      if(!coordinates) {
          toast.error("Please pin your location on the map."); return;
      }
      if(!isDeliverable) {
          toast.error("Location is too far (>20km)."); return;
      }
      
      navigate("/place-order", { 
          state: { 
              address: detectedAddress, 
              coordinates: coordinates,
              deliveryFee: deliveryFee,
              distance: distance
          } 
      });
  }

  if (cartData.length === 0) return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"><img src={assets.cart_icon} className="w-10 opacity-40" alt="" /></div>
        <p className="text-xl font-semibold mb-2 text-gray-800">Your Cart is Empty</p>
        <Link to="/collection" className="px-8 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 shadow-md">Browse Medicines</Link>
      </div>
  );

  return (
    <div className="border-t pt-10 px-4 sm:px-8 max-w-7xl mx-auto mb-20">
      <div className="text-2xl mb-8"><Title text1={"YOUR"} text2={"CART"} /></div>

      <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- LEFT: PRODUCTS --- */}
          <div className="flex-1 flex flex-col gap-6">
              {cartData.some(item => products.find(p => p._id === item._id)?.prescriptionRequired) && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2 text-sm text-red-700 font-medium">
                      <span>⚠️</span> Rx Prescription required for some items.
                  </div>
              )}

              {/* Product List */}
              <div className="flex flex-col gap-4">
                  {cartData.map((item, index) => {
                    const productData = products.find((p) => p._id === item._id);
                    if (!productData) return null;
                    return (
                      <div key={index} className="py-4 border border-gray-100 rounded-xl px-4 flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 p-1 flex-shrink-0">
                            <img src={productData.image?.[0]} alt={productData.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-bold text-gray-800 line-clamp-1">{productData.name}</p>
                            <p className="text-xs text-gray-500 mb-1">{productData.packSize}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-emerald-700 font-bold">{currency}{productData.price}</p>
                                <div className="flex items-center gap-3">
                                    {/* --- INPUT FIX START --- */}
                                    <input 
                                      type="number" 
                                      min={1} 
                                      defaultValue={item.quantity} 
                                      onChange={(e) => {
                                          const value = e.target.value;
                                          // Agar empty hai ya '0' hai, to update mat karo (wait karo)
                                          if (value === '' || value === '0') return; 
                                          // Valid number hone par hi update karo
                                          updateQuantity(item._id, Number(value));
                                      }} 
                                      className="border border-gray-300 px-2 py-1 w-14 text-center rounded focus:outline-emerald-500"
                                    />
                                    {/* --- INPUT FIX END --- */}

                                    <img src={assets.bin_icon} onClick={() => updateQuantity(item._id, 0)} className="w-5 cursor-pointer opacity-60 hover:text-red-500" alt="Delete"/>
                                </div>
                            </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* --- ADD MORE BUTTON --- */}
              <Link 
                to="/collection"
                className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 px-4 py-4 rounded-xl hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all font-semibold"
              >
                <span className="text-xl leading-none">+</span> Add More Medicines
              </Link>

          </div>

          {/* --- RIGHT: LOCATION & TOTAL --- */}
          <div className="lg:w-[450px] flex flex-col gap-6">
              
              {/* 1. Map Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📍</span>
                      <h2 className="text-xl font-bold text-gray-800">Check Delivery</h2>
                  </div>
                  
                  <LocationPicker setLocation={setCoordinates} onAddressSelect={handleAddressFromMap} />
                  
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                     <p className="text-gray-500 text-xs font-bold uppercase mb-1">Delivering To:</p>
                     <p className="text-gray-800">{detectedAddress.street ? `${detectedAddress.street}, ${detectedAddress.city}` : "Please pin location above"}</p>
                     {detectedAddress.zipcode && <p className="text-gray-600 text-xs">{detectedAddress.state} - {detectedAddress.zipcode}</p>}
                  </div>
              </div>

              {/* 2. Bill Summary */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bill Details</h2>
                  <div className="flex flex-col gap-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                          <p>Subtotal</p>
                          <p className="font-medium text-gray-900">{currency}{cartTotal}</p>
                      </div>
                      <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <p>Delivery Fee</p>
                            {coordinates && <span className="text-[10px] text-gray-400">Dist: {distance}km</span>}
                          </div>
                          {coordinates ? (
                              <p className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                  {deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee}`}
                              </p>
                          ) : (
                              <span className="text-xs text-orange-500">Select location first</span>
                          )}
                      </div>
                  </div>
                  <hr className="border-gray-100 my-4"/>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
                      <p>To Pay</p>
                      <p>{currency}{cartTotal + deliveryFee}</p>
                  </div>

                  {isDeliverable && deliveryFee > 0 && (
                      <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded text-center mb-4 border border-blue-100">
                          {freeDeliveryMsg}
                      </div>
                  )}
                  {isDeliverable && deliveryFee === 0 && coordinates && (
                      <div className="bg-green-50 text-green-700 text-xs p-2 rounded text-center mb-4 border border-green-100 font-medium">
                          🎉 You have unlocked FREE Delivery!
                      </div>
                  )}
                  {!isDeliverable && (
                      <div className="bg-red-50 text-red-700 text-xs p-2 rounded text-center mb-4 border border-red-100 font-bold">
                          🚫 Location too far (>20km). Not Deliverable.
                      </div>
                  )}

                  <button 
                    onClick={handleProceed}
                    disabled={!isDeliverable}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${isDeliverable ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    CONTINUE TO CHECKOUT
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Cart;