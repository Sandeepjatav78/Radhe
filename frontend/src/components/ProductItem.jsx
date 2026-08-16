import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductItem = ({ id, image, name, price, mrp, salt, packSize, isRx, variants }) => {
  const { currency, addToCart, updateQuantity, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const productImage = Array.isArray(image) ? image[0] : image || "/default.jpg";

  let displayPrice = price;
  let displayMrp = mrp;
  let displaySize = packSize;

  if (variants && variants.length > 0) {
    displayPrice = variants[0].price;
    displayMrp = variants[0].mrp;
    displaySize = variants[0].size;
  }

  const discount = displayMrp && displayPrice && displayMrp > displayPrice
    ? Math.floor(((displayMrp - displayPrice) / displayMrp) * 100)
    : 0;

  const getQuantity = () => {
    if (!displaySize) return 0;
    return cartItems[id]?.[displaySize] || 0;
  };

  const currentQuantity = getQuantity();

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

  const handleQuantityChange = async (e, action) => {
    e.preventDefault();
    e.stopPropagation();

    const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 0) return;

    await updateQuantity(id, displaySize, newQuantity);
  };

  const handleProductClick = (e) => {
    const target = e.target;
    const isButton = target.closest('button');
    const isCartControl = target.closest('.cart-controls');

    if (isCartControl && isButton) return;

    navigate(`/product/${id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden relative fade-in-up"
    >
      {isRx && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-50 text-red-500 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 z-10 shadow-sm flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span> Rx
        </div>
      )}

      {discount > 0 && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-brand text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md z-10 shadow-md">
          {discount}% OFF
        </div>
      )}

      <div className="w-full h-36 sm:h-48 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center relative p-3 sm:p-4">
        <img
          src={productImage}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4 flex flex-col gap-1">
        {salt && (
          <p className="text-[9px] sm:text-[10px] text-brand font-semibold tracking-wide uppercase line-clamp-1">
            {salt}
          </p>
        )}

        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[2em] sm:min-h-[2.5em] group-hover:text-brand transition-colors">
          {name}
        </h3>

        {displaySize && (
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded inline-block w-fit border border-gray-100">
            {displaySize}
          </p>
        )}

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <div className="flex-1">
            {discount > 0 && (
              <p className="text-[9px] sm:text-[10px] text-gray-400 line-through font-medium">
                {currency}{displayMrp}
              </p>
            )}
            <p className="text-sm sm:text-base font-extrabold text-gray-900 leading-none">
              {currency}{displayPrice}
            </p>
          </div>

          <div className="cart-controls flex-shrink-0">
            {currentQuantity === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="bg-brand-light text-brand-dark border border-brand/30 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-brand hover:text-white active:scale-95 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {isAdding ? '...' : 'ADD'}
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 bg-brand rounded-lg shadow-md px-1 py-1">
                <button
                  onClick={(e) => handleQuantityChange(e, 'decrease')}
                  className="bg-white text-brand-dark w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold text-base sm:text-lg hover:bg-gray-50 active:scale-90 transition-all"
                >
                  −
                </button>
                <span className="text-white font-bold text-xs sm:text-sm min-w-[20px] sm:min-w-[24px] text-center">
                  {currentQuantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(e, 'increase')}
                  className="bg-white text-brand-dark w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold text-base sm:text-lg hover:bg-gray-50 active:scale-90 transition-all"
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