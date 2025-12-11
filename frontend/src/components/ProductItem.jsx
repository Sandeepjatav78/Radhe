import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, salt, packSize, isRx }) => {
  const { currency } = useContext(ShopContext);
  
  // Pharmacy images usually look better with 'contain' so text is readable
  const productImage = Array.isArray(image) ? image[0] : image || "/default.jpg";

  return (
    <Link to={`/product/${id}`} className="block group bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 p-3 relative">
      
      {/* Rx Badge - Show only if prescription is required */}
      {isRx && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 z-10">
          Rx
        </div>
      )}

      {/* Image Container */}
      <div className="w-full h-40 sm:h-48 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg mb-3">
        <img
          src={productImage}
          alt={name}
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1">
        {/* Brand Name */}
        <p className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {name}
        </p>

        {/* Salt Name (Composition) - Very Important for Pharmacy */}
        {salt && (
            <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 leading-tight min-h-[2.5em]">
                {salt}
            </p>
        )}

        {/* Pack Size & Price Row */}
        <div className="flex justify-between items-end mt-2">
             {packSize && (
                <p className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {packSize}
                </p>
            )}
            <p className="text-sm font-bold text-emerald-700">
                {currency}{price}
            </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;