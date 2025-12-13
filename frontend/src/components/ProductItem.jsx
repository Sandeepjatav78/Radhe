import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, mrp, salt, packSize, isRx }) => {
  const { currency } = useContext(ShopContext);
  
  const productImage = Array.isArray(image) ? image[0] : image || "/default.jpg";

  // --- DISCOUNT CALCULATION LOGIC ---
  // Agar MRP exist karta hai aur Price se jyada hai, tabhi discount calculate karo
  const discount = mrp && price && mrp > price 
    ? Math.floor(((mrp - price) / mrp) * 100) 
    : 0;

  return (
    <Link 
      to={`/product/${id}`} 
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 overflow-hidden relative"
    >
      
      {/* 1. Rx Badge (Left Side) */}
      {isRx && (
        <div className="absolute top-3 left-3 bg-red-50 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100 z-10 shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Rx
        </div>
      )}

      {/* 2. Discount Badge (Right Side) - Sirf tab dikhega jab discount > 0 ho */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md z-10 border border-green-200">
           {discount}% OFF
        </div>
      )}

      {/* Image Container */}
      <div className="w-full h-48 sm:h-56 bg-white flex items-center justify-center relative p-4">
        <img
          src={productImage}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Product Details Section */}
      <div className="px-4 pb-4 pt-1 flex flex-col gap-1">
        
        {/* Salt Name */}
        {salt && (
            <p className="text-[10px] sm:text-xs text-emerald-600 font-medium tracking-wide uppercase line-clamp-1">
                {salt}
            </p>
        )}

        {/* Brand Name */}
        <h3 className="text-sm sm:text-[15px] font-bold text-gray-800 leading-tight line-clamp-2 min-h-[2.5em] group-hover:text-emerald-700 transition-colors">
            {name}
        </h3>

        {/* Footer: Pack Size & Price Calculation */}
        <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-50/50">
           
           {/* Pack Size Box */}
           {packSize ? (
               <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md mb-1">
                   {packSize}
               </p>
           ) : <span></span>}
           
           {/* Price Section */}
           <div className="text-right">
               {/* Agar Discount hai, to MRP dikhao (Kata hua) */}
               {discount > 0 && (
                   <p className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                       MRP {currency}{mrp}
                   </p>
               )}
               {/* Final Selling Price */}
               <p className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                   {currency}{price}
               </p>
           </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;