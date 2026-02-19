import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LocationPicker from "../components/LocationPicker";
import AvailableCoupons from "../components/AvailableCoupons";
import CouponCode from "../components/CouponCode";
import axios from "axios";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, backendUrl, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  
  // --- CALCULATION STATES ---
  const [coordinates, setCoordinates] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  }); 
  const [cartTotal, setCartTotal] = useState(0);        
  const [deliveryFee, setDeliveryFee] = useState(0);    
  const [distance, setDistance] = useState(0);          
  const [isDeliverable, setIsDeliverable] = useState(true);
  const [freeDeliveryMsg, setFreeDeliveryMsg] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Address State
  const [detectedAddress, setDetectedAddress] = useState(() => {
    const saved = localStorage.getItem('userAddress');
    return saved ? JSON.parse(saved) : {
      street: "", city: "", state: "", zipcode: "", country: "India"
    };
  });

  const STORE_COORDS = { lat: 29.410327, lng: 76.9870635 }; // Radhe Pharmacy, Panipat

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

  // --- 1. CART DATA LOGIC (HANDLES VARIANTS) ---
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      let total = 0;

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            
            const product = products.find((p) => p._id === itemId);
            
            if (product) {
               let variantPrice = 0;
               if (product.variants && product.variants.length > 0) {
                   const variant = product.variants.find(v => v.size === size);
                   variantPrice = variant ? variant.price : product.price; 
               } else {
                   variantPrice = product.price; 
               }

               tempData.push({
                 _id: itemId,
                 size: size,
                 quantity: cartItems[itemId][size],
                 price: variantPrice 
               });

               total += variantPrice * cartItems[itemId][size];
            }
          }
        }
      }
      
      setCartData(tempData);
      setCartTotal(total);
    }
  }, [cartItems, products]);

  // --- SAVE LOCATION TO LOCALSTORAGE ---
  useEffect(() => {
    if (coordinates) {
      try {
        localStorage.setItem('userLocation', JSON.stringify(coordinates));
        console.log('✅ Location saved:', coordinates);
      } catch (error) {
        console.error('❌ Failed to save location:', error);
      }
    }
  }, [coordinates]);

  useEffect(() => {
    if (detectedAddress && detectedAddress.city) {
      try {
        localStorage.setItem('userAddress', JSON.stringify(detectedAddress));
        console.log('✅ Address saved:', detectedAddress);
      } catch (error) {
        console.error('❌ Failed to save address:', error);
      }
    }
  }, [detectedAddress]);

  // --- SIMPLIFIED DELIVERY CALCULATION (Like Blinkit/Zomato) ---
  useEffect(() => {
    if (coordinates) {
        const dist = getDistanceFromLatLonInKm(STORE_COORDS.lat, STORE_COORDS.lng, coordinates.lat, coordinates.lng);
        setDistance(dist);

        let fee = 0;
        let msg = "";
        let deliverable = true;

        // Delivery not available beyond 20km
        if (dist > 20) {
            deliverable = false;
        } 
        // Free delivery within 500m (0.5km)
        else if (dist <= 0.5) {
            fee = 0;
            msg = "🎉 Free delivery in your area!";
        } 
        // Tiered pricing for distance
        else if (dist <= 3) {
            fee = 20;
            msg = "Delivery fee: ₹20 for deliveries within 3km";
        } 
        else if (dist <= 7) {
            fee = 40;
            msg = "Delivery fee: ₹40 for deliveries within 7km";
        } 
        else if (dist <= 15) {
            fee = 70;
            msg = "Delivery fee: ₹70 for deliveries within 15km";
        } 
        else { 
            fee = 100;
            msg = "Delivery fee: ₹100 for deliveries up to 20km";
        }

        setDeliveryFee(fee);
        setFreeDeliveryMsg(msg);
        setIsDeliverable(deliverable);
    }
  }, [cartTotal, coordinates, currency]);

  const handleAddressFromMap = (addressObj, showToast = true) => {
    setDetectedAddress(addressObj);
    if (showToast) {
      toast.success("✅ Location saved!", {autoClose: 1000});
    }
  };

  // --- COUPON VALIDATION ---
  const applyCoupon = async (codeToApply = null) => {
    const code = codeToApply || couponCode;
    
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!token) {
      toast.error("Please login to apply coupon");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/coupon/validate",
        { code: code, cartTotal },
        { headers: { token } }
      );

      if (response.data.success) {
        const { discount, code: validCode } = response.data.coupon;
        setCouponDiscount(discount);
        setAppliedCoupon(validCode);
        setCouponCode(validCode); // Update input field too
        toast.success(`🎉 Coupon applied! You saved ${currency}${discount}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      
      // Fallback to hardcoded coupons if API fails
      const validCoupons = {
        "RADHE10": { type: "percent", value: 10, minOrder: 200 },
        "RADHE15": { type: "percent", value: 15, minOrder: 500 },
        "RADHE20": { type: "percent", value: 20, minOrder: 1000 },
        "FIRST50": { type: "flat", value: 50, minOrder: 300 },
        "SAVE100": { type: "flat", value: 100, minOrder: 500 },
        "SAVE200": { type: "flat", value: 200, minOrder: 1000 },
        "SAVE300": { type: "flat", value: 300, minOrder: 1500 },
        "WELCOME50": { type: "flat", value: 50, minOrder: 250 },
        "NEWUSER": { type: "percent", value: 25, minOrder: 300, maxDiscount: 150 },
        "HEALTH25": { type: "percent", value: 25, minOrder: 600, maxDiscount: 250 },
        "FREEDEL": { type: "delivery", value: 100, minOrder: 0 },
        "FREESHIP": { type: "delivery", value: 100, minOrder: 200 },
      };

      const coupon = validCoupons[code.toUpperCase()];
      
      if (!coupon) {
        toast.error("❌ Invalid coupon code");
        return;
      }

      if (cartTotal < coupon.minOrder) {
        toast.error(`Minimum order of ${currency}${coupon.minOrder} required`);
        return;
      }

      let discount = 0;
      if (coupon.type === "percent") {
        discount = Math.round((cartTotal * coupon.value) / 100);
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else if (coupon.type === "flat") {
        discount = coupon.value;
      } else if (coupon.type === "delivery") {
        discount = Math.min(deliveryFee, coupon.value);
      }

      setCouponDiscount(discount);
      setAppliedCoupon(code.toUpperCase());
      setCouponCode(code.toUpperCase());
      toast.success(`🎉 Coupon applied! You saved ${currency}${discount}`);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
    toast.info("Coupon removed");
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
              distance: distance,
              couponCode: appliedCoupon,
              couponDiscount: couponDiscount
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
    <div className="border-t pt-6 sm:pt-10 px-2 sm:px-4 lg:px-8 max-w-7xl mx-auto mb-32 sm:mb-20">
      <div className="text-xl sm:text-2xl mb-6 sm:mb-8 px-2"><Title text1={"YOUR"} text2={"CART"} /></div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-12">
          
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
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-base font-bold text-gray-800 line-clamp-1">{productData.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200">{item.size}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-emerald-700 font-bold">{currency}{item.price}</p>
                                <div className="flex items-center gap-3">
                                    <input 
                                      type="number" 
                                      min={1} 
                                      defaultValue={item.quantity} 
                                      onChange={(e) => {
                                          const value = e.target.value;
                                          if (value === '' || value === '0') return; 
                                          updateQuantity(item._id, item.size, Number(value));
                                      }} 
                                      className="border border-gray-300 px-2 py-1 w-14 text-center rounded focus:outline-emerald-500"
                                    />
                                    <img src={assets.bin_icon} onClick={() => updateQuantity(item._id, item.size, 0)} className="w-5 cursor-pointer opacity-60 hover:text-red-500" alt="Delete"/>
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
                  
                  {/* Map will update automatically because setLocation receives new coords */}
                  <LocationPicker setLocation={setCoordinates} onAddressSelect={handleAddressFromMap} />
                  
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Delivering To:</p>
                      <p className="text-gray-800">{detectedAddress.street ? `${detectedAddress.street}, ${detectedAddress.city}` : "Detecting location..."}</p>
                      {detectedAddress.zipcode && <p className="text-gray-600 text-xs">{detectedAddress.state} - {detectedAddress.zipcode}</p>}
                  </div>
              </div>

              {/* 2. Bill Summary */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bill Details</h2>
                  
                  {/* Available Coupons */}
                  {!appliedCoupon && (
                    <AvailableCoupons 
                      onApplyCoupon={applyCoupon}
                      cartTotal={cartTotal}
                    />
                  )}
                  
                  {/* Coupon Section with CouponCode Component */}
                  <div className="mb-4">
                    <CouponCode 
                      cartTotal={cartTotal}
                      appliedCoupon={appliedCoupon}
                      onApplyCoupon={applyCoupon}
                      onRemoveCoupon={removeCoupon}
                      couponDiscount={couponDiscount}
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                          <p>Subtotal</p>
                          <p className="font-medium text-gray-900">{currency}{cartTotal}</p>
                      </div>
                      <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <p>Delivery Fee</p>
                            {coordinates && <span className="text-[10px] text-gray-400">Dist: {distance.toFixed(1)}km</span>}
                          </div>
                          {coordinates ? (
                              <p className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                  {deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee}`}
                              </p>
                          ) : (
                              <span className="text-xs text-orange-500">Fetching...</span>
                          )}
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <p>Coupon Discount</p>
                          <p className="font-medium">-{currency}{couponDiscount}</p>
                        </div>
                      )}
                  </div>
                  <hr className="border-gray-100 my-4"/>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
                      <p>To Pay</p>
                      <p>{currency}{Math.max(0, cartTotal + deliveryFee - couponDiscount)}</p>
                  </div>

                  {freeDeliveryMsg && (
                      <div className={`text-xs p-2 rounded text-center mb-4 border ${
                        deliveryFee === 0 
                          ? 'bg-green-50 text-green-700 border-green-100 font-medium'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                          {freeDeliveryMsg}
                      </div>
                  )}
                  {!isDeliverable && (
                      <div className="bg-red-50 text-red-700 text-xs p-2 rounded text-center mb-4 border border-red-100 font-bold">
                          🚫 Location too far (&gt;20km). Not Deliverable.
                      </div>
                  )}

                  <button 
                    onClick={handleProceed}
                    disabled={!isDeliverable}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all hidden sm:block ${isDeliverable ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    CONTINUE TO CHECKOUT
                  </button>
              </div>
          </div>
      </div>

      {/* Sticky Mobile Checkout Bar - Blinkit Style */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-lg font-black text-gray-900">{currency}{cartTotal - couponDiscount + deliveryFee}</p>
          </div>
          <button 
            onClick={handleProceed}
            disabled={!isDeliverable}
            className={`flex-1 py-3.5 rounded-xl font-bold shadow-lg transition-all ${isDeliverable ? 'bg-emerald-600 text-white active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isDeliverable ? 'CHECKOUT' : 'NOT DELIVERABLE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;