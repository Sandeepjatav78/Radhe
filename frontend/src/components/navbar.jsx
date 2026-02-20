import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; // ✅ Added useLocation
import { useClerk } from "@clerk/clerk-react"; // ✅ Import Clerk
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [visible, setVisible] = useState(false); 

  const { setShowSearch, getCartCount, setToken, token, setCartItems } = useContext(ShopContext);
  const { signOut } = useClerk(); // ✅ Get Clerk's signOut function
  
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      // ✅ Sign out from Clerk
      await signOut();
      
      // Clear frontend state
      localStorage.removeItem("token");
      localStorage.removeItem("cartData"); // ✅ Also clear cached cart
      setToken("");
      setCartItems({});
      
      // Redirect to login
      navigate("/login");
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback: clear state manually
      localStorage.removeItem("token");
      localStorage.removeItem("cartData");
      setToken("");
      setCartItems({});
      navigate("/login");
    }
  };

  return (
    <>
      {/* =======================================
          TOP NAVBAR (Desktop & Mobile Header) 
          ======================================= */}
      <div className="sticky sm:px-5 top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex h-16 items-center justify-between py-2 px-4 max-w-[1440px] mx-auto font-medium">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={assets.logo} 
              className="h-9 sm:h-11 w-auto object-contain" 
              alt="Radhe Pharmacy" 
            />
          </Link>

          {/* --- DESKTOP LINKS (Hidden on Mobile) --- */}
          <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
            <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-emerald-700" : ""}`}>
              <p>HOME</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-emerald-700 hidden" />
            </NavLink>
            <NavLink to="/collection" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-emerald-700" : ""}`}>
              <p>MEDICINES</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-emerald-700 hidden" />
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-emerald-700" : ""}`}>
              <p>ABOUT</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-emerald-700 hidden" />
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-emerald-700" : ""}`}>
              <p>CONTACT</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-emerald-700 hidden" />
            </NavLink>
          </ul>

          {/* --- ICONS SECTION --- */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* SEARCH ICON */}
            <img 
              onClick={() => { 
                  setShowSearch(true);       
                  navigate('/collection');   
              }} 
              src={assets.search_icon} 
              className="w-5 cursor-pointer hover:opacity-80" 
              alt="Search" 
            />

            {/* DESKTOP ONLY: Profile & Cart */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="relative group">
                <img onClick={() => token ? setProfileOpen(!profileOpen) : navigate("/login")} src={assets.profile_icon} className="w-5 cursor-pointer hover:opacity-80" alt="Profile" />
                {token && profileOpen && (
                  <div className="absolute right-0 pt-4 z-50">
                    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-xl border border-gray-100">
                      <p onClick={()=>{navigate('/profile'); setProfileOpen(false);}} className="cursor-pointer hover:text-emerald-600 transition">My Profile</p>
                      <p onClick={()=>{navigate('/orders'); setProfileOpen(false);}} className="cursor-pointer hover:text-emerald-600 transition">Orders</p>
                      <p onClick={logout} className="cursor-pointer hover:text-emerald-600 transition">Logout</p>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/cart" className="relative">
                <img src={assets.cart_icon} className="w-5 min-w-5 hover:opacity-80" alt="Cart" />
                <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-emerald-600 text-white aspect-square rounded-full text-[8px]">
                  {getCartCount()}
                </p>
              </Link>
            </div>

            {/* MOBILE ONLY: Menu Icon */}
            <img 
              onClick={() => setVisible(true)} 
              src={assets.menu_icon} 
              className="w-5 cursor-pointer sm:hidden" 
              alt="Menu" 
            />
          </div>
        </div>
      </div>

      {/* =======================================
          MOBILE BOTTOM NAVIGATION BAR (New Modern Icons)
          ======================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-6 py-2 pb-3">
        <div className="flex justify-between items-center text-[10px] font-medium text-gray-500">
          
          {/* 1. Home Tab */}
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? "text-emerald-600 font-bold" : "text-gray-400 hover:text-emerald-500"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={location.pathname === '/' ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </NavLink>

          {/* 2. Medicines Tab */}
          <NavLink to="/collection" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? "text-emerald-600 font-bold" : "text-gray-400 hover:text-emerald-500"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={location.pathname === '/collection' ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 20.5 19 12a4.95 4.95 0 1 0-7-7L3.5 13.5a4.95 4.95 0 1 0 7 7Z"/>
              <path d="m8.5 8.5 7 7"/>
            </svg>
            <span>Medicines</span>
          </NavLink>

          {/* 3. Orders Tab */}
          <NavLink to={token ? "/orders" : "/login"} className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? "text-emerald-600 font-bold" : "text-gray-400 hover:text-emerald-500"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={location.pathname === '/orders' ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.29 7 12 12 20.71 7"/>
              <line x1="12" y1="22" x2="12" y2="12"/>
            </svg>
            <span>Orders</span>
          </NavLink>

          {/* 4. Cart Tab */}
          <NavLink to="/cart" className={({ isActive }) => `relative flex flex-col items-center gap-1 transition-colors ${isActive ? "text-emerald-600 font-bold" : "text-gray-400 hover:text-emerald-500"}`}>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={location.pathname === '/cart' ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center bg-emerald-600 text-white rounded-full text-[9px] font-bold">
                {getCartCount()}
              </p>
            </div>
            <span>Cart</span>
          </NavLink>

        </div>
      </div>

      {/* =======================================
          MOBILE SIDEBAR (Full Screen Menu)
          ======================================= */}
      <div 
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white w-full h-screen transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
          <div className="flex flex-col h-full bg-white text-gray-800">
              {/* Back Button */}
              <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p-5 cursor-pointer border-b border-gray-100 hover:bg-gray-50 bg-white">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="back" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">Close</p>
              </div>

              {/* Profile / Login Block */}
              <div className="p-6 border-b border-gray-100">
                {token ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-lg font-bold text-emerald-700">Welcome Back!</p>
                    <button onClick={() => { setVisible(false); logout(); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium text-left border border-red-100">🚪 Logout</button>
                  </div>
                ) : (
                  <button onClick={() => { setVisible(false); navigate('/login'); }} className="w-full bg-black text-white font-bold py-3 rounded-xl shadow-lg">Login / Sign Up</button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col p-4 gap-2 bg-white">
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/about'>ℹ️ About Us</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/contact'>📞 Contact Us</NavLink>
              </div>

              {/* Branding */}
              <div className="mt-auto p-8 flex justify-center opacity-40 bg-white">
                 <img src={assets.logo} className="w-32 grayscale" alt="Logo" />
              </div>
          </div>
      </div>
    </>
  );
};

export default Navbar;