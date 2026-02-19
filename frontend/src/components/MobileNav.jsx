import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const MobileNav = () => {
  const { getCartCount, setShowSearch, navigate, token } = useContext(ShopContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 sm:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        
        {/* Home */}
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-500'
            }`
          }
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-semibold">Home</span>
        </NavLink>

        {/* Categories */}
        <NavLink 
          to="/collection" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-500'
            }`
          }
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-[10px] font-semibold">Shop</span>
        </NavLink>

        {/* Search */}
        <button
          onClick={() => {
            setShowSearch(true);
            navigate('/collection');
          }}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-semibold">Search</span>
        </button>

        {/* Cart */}
        <NavLink 
          to="/cart" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-0.5 flex-1 relative transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-500'
            }`
          }
        >
          <div className="relative">
            <img src={assets.cart_icon} alt="" className="w-6 h-6" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Cart</span>
        </NavLink>

        {/* Profile/Account */}
        <NavLink 
          to={token ? "/profile" : "/login" }
          className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-500'
            }`
          }
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-semibold">Account</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;
