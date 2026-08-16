import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const MobileNav = () => {
  const { getCartCount, setShowSearch, navigate, token } = useContext(ShopContext);

  const tabClass = (isActive) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
      isActive ? 'text-brand' : 'text-gray-500'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 sm:hidden">
      <div className="flex items-center justify-around h-16 px-2 pb-1">
        
        {/* Home */}
        <NavLink to="/" className={({ isActive }) => tabClass(isActive)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-semibold">Home</span>
        </NavLink>

        {/* Shop */}
        <NavLink to="/collection" className={({ isActive }) => tabClass(isActive)}>
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
          className="flex flex-col items-center justify-center gap-0.5 flex-1 text-gray-500 hover:text-brand transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-semibold">Search</span>
        </button>

        {/* Cart */}
        <NavLink to="/cart" className={({ isActive }) => tabClass(isActive)}>
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Cart</span>
        </NavLink>

        {/* Account */}
        <NavLink to={token ? "/profile" : "/login"} className={({ isActive }) => tabClass(isActive)}>
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