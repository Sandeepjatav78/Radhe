import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      // --- UPDATED LOGIC: No Sizes, just Item ID & Quantity ---
      for (const itemId in cartItems) {
         if (cartItems[itemId] > 0) {
            tempData.push({
              _id: itemId,
              quantity: cartItems[itemId],
            });
         }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Check if any item needs prescription (Optional UI enhancement)
  const hasRxItems = cartData.some(item => {
      const product = products.find(p => p._id === item._id);
      return product?.prescriptionRequired;
  });

  if (cartData.length === 0)
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500 px-4">
        {/* Empty Cart Icon - using a generic cart icon or asset */}
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <img src={assets.cart_icon} className="w-10 opacity-40" alt="" />
        </div>
        <p className="text-xl font-semibold mb-2 text-gray-800">Your Cart is Empty</p>
        <p className="text-gray-400 mb-6">Add medicines to your cart to proceed.</p>
        <Link
          to="/collection"
          className="px-8 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-md"
        >
          Browse Medicines
        </Link>
      </div>
    );

  return (
    <div className="border-t pt-14 px-4 sm:px-8 max-w-7xl mx-auto">
      
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Prescription Warning Banner */}
      {hasRxItems && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                  <p className="text-red-700 font-bold text-sm">Prescription Required</p>
                  <p className="text-red-600 text-sm">Some items in your cart require a doctor's prescription. You will be asked to upload it in the next step.</p>
              </div>
          </div>
      )}

      <div className="flex flex-col gap-4">
        {cartData.map((item, index) => {
          const productData = products.find((p) => p._id === item._id);
          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border border-gray-100 rounded-xl px-4 grid grid-cols-1 sm:grid-cols-[4fr_1fr_0.5fr] items-center gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 p-1">
                    <img
                    src={productData.image?.[0]}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-sm sm:text-lg font-bold text-gray-800">
                    {productData.name}
                  </p>
                  <p className="text-xs text-gray-500">{productData.packSize}</p>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-emerald-700 font-bold">
                      {currency}
                      {productData.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                  <p className="sm:hidden text-sm text-gray-500">Qty:</p>
                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) =>
                    e.target.value !== "" &&
                    e.target.value !== "0" &&
                    // Size parameter removed (passed null or ignored by context)
                    updateQuantity(item._id, Number(e.target.value)) 
                    }
                    className="border border-gray-300 px-3 py-1 w-20 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Delete */}
              <div className="flex justify-end sm:justify-center">
                  <img
                    src={assets.bin_icon}
                    alt="Remove"
                    onClick={() => updateQuantity(item._id, 0)}
                    className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-red-500 hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Total */}
      <div className="flex justify-end mt-12">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="text-end mt-6">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-emerald-600 w-full sm:w-auto cursor-pointer text-white text-sm px-8 py-3.5 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;