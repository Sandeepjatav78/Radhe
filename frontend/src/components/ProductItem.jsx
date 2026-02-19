import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductItem = ({ id, image, name, price, mrp, salt, packSize, isRx, variants }) => {
  const { currency, addToCart, updateQuantity, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  
  const productImage = Array.isArray(image) ? image[0] : image || "/default.jpg";

  // --- SMART PRICE LOGIC ---
  let displayPrice = price;
  let displayMrp = mrp;
  let displaySize = packSize;

  // Agar 'variants' array exist karta hai aur usme data hai, to first variant ka data use karo
  if (variants && variants.length > 0) {
      displayPrice = variants[0].price;
      displayMrp = variants[0].mrp;
      displaySize = variants[0].size;
  }

  // --- DISCOUNT CALCULATION ---
  const discount = displayMrp && displayPrice && displayMrp > displayPrice 
    ? Math.floor(((displayMrp - displayPrice) / displayMrp) * 100) 
    : 0;

  // --- GET CURRENT QUANTITY IN CART ---
  const getQuantity = () => {
    if (!displaySize) return 0;
    return cartItems[id]?.[displaySize] || 0;
  };

  const currentQuantity = getQuantity();

  // --- ADD TO CART HANDLER ---
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!displaySize) {
      toast.error("Product variant not available");
      return;
    }

    setIsAdding(true);
    await addToCart(id, displaySize);
    setTimeout(() => setIsAdding(false), 300);
  };

  // --- INCREASE/DECREASE QUANTITY ---
  const handleQuantityChange = async (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    
    if (newQuantity < 0) return;
    
    await updateQuantity(id, displaySize, newQuantity);
  };

  // --- NAVIGATE TO PRODUCT PAGE ---
  const handleProductClick = (e) => {
    // Prevent navigation only if clicking on cart controls buttons
    const target = e.target;
    const isButton = target.closest('button');
    const isCartControl = target.closest('.cart-controls');
    
    if (isCartControl && isButton) {
      // Let button handlers take precedence
      return;
    }
    
    // Navigate for any other click
    navigate(`/product/${id}`);
  };

  return (
    <div 
      onClick={handleProductClick}
      className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden relative fade-in-up"
    >
      
      {/* 1. Rx Badge */}
      {isRx && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-50 text-red-500 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-red-100 z-10 shadow-sm flex items-center gap-1">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full animate-pulse"></span> Rx
        </div>
      )}

      {/* 2. Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md z-10 shadow-md">
           {discount}% OFF
        </div>
      )}

      {/* Image Container */}
      <div className="w-full h-36 sm:h-48 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center relative p-3 sm:p-4 cursor-pointer" onClick={handleProductClick}>
        <img
          src={productImage}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 brightness-105 cursor-pointer"
          onClick={handleProductClick}
        />
      </div>

      {/* Product Details Section */}
      <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4 flex flex-col gap-1">
        
        {/* Salt Name */}
        {salt && (
            <p className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold tracking-wide uppercase line-clamp-1">
                {salt}
            </p>
        )}

        {/* Brand Name */}
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight line-clamp-2 min-h-[2em] sm:min-h-[2.5em] group-hover:text-emerald-700 transition-colors cursor-pointer" onClick={handleProductClick}>
            {name}
        </h3>

        {/* Pack Size */}
        {displaySize && (
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded inline-block w-fit">
            {displaySize}
          </p>
        )}

        {/* Footer: Price & Cart Controls */}
        <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-100">
           
           {/* Price Section */}
           <div className="flex-1">
               {discount > 0 && (
                   <p className="text-[9px] sm:text-[10px] text-gray-400 line-through font-medium">
                       {currency}{displayMrp}
                   </p>
               )}
               <p className="text-sm sm:text-base font-black text-gray-900 leading-none">
                   {currency}{displayPrice}
               </p>
           </div>

           {/* Blinkit-Style Cart Controls */}
           <div className="cart-controls flex-shrink-0">
             {currentQuantity === 0 ? (
               /* ADD Button */
               <button
                 onClick={handleAddToCart}
                 disabled={isAdding}
                 className="bg-white border-2 border-emerald-500 text-emerald-600 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-emerald-50 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 whitespace-nowrap"
               >
                 {isAdding ? '...' : 'ADD'}
               </button>
             ) : (
               /* Quantity Controls */
               <div className="flex items-center gap-1 sm:gap-2 bg-emerald-500 rounded-lg shadow-md px-1 py-1">
                 <button
                   onClick={(e) => handleQuantityChange(e, 'decrease')}
                   className="bg-white text-emerald-600 w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold text-base sm:text-lg hover:bg-emerald-50 active:scale-90 transition-all"
                 >
                   −
                 </button>
                 <span className="text-white font-bold text-xs sm:text-sm min-w-[20px] sm:min-w-[24px] text-center">
                   {currentQuantity}
                 </span>
                 <button
                   onClick={(e) => handleQuantityChange(e, 'increase')}
                   className="bg-white text-emerald-600 w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold text-base sm:text-lg hover:bg-emerald-50 active:scale-90 transition-all"
                 >
                   +
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;