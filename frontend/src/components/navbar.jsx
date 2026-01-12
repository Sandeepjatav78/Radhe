import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [visible, setVisible] = useState(false); 

  const { setShowSearch, getCartCount, setToken, token, setCartItems } = useContext(ShopContext);
  
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="sticky sm:px-5 top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      <div className="flex h-16 items-center justify-between py-2 px-4 max-w-[1440px] mx-auto font-medium">
        
        <Link to="/" className="flex items-center gap-2">
            <img 
              src={assets.logo} 
              className="h-9 sm:h-11 w-auto object-contain" 
              alt="Radhe Pharmacy" 
            />
        </Link>

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

        <div className="flex items-center gap-4 sm:gap-6">
          {/* ✅ UPDATED SEARCH ICON LOGIC */}
          <img 
            onClick={() => { 
                setShowSearch(true);       // 1. Open Search Bar
                navigate('/collection');   // 2. Go to Collection Page
            }} 
            src={assets.search_icon} 
            className="w-5 cursor-pointer hover:opacity-80" 
            alt="Search" 
          />

          <div className="relative group">
            <img onClick={() => token ? setProfileOpen(!profileOpen) : navigate("/login")} src={assets.profile_icon} className="w-5 cursor-pointer hover:opacity-80" alt="Profile" />
            
            {token && profileOpen && (
              <div className="absolute right-0 pt-4 z-50">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-xl border border-gray-100">
                  <p onClick={()=>navigate('/orders')} className="cursor-pointer hover:text-emerald-600 transition">Orders</p>
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

          <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="Menu" />
        </div>
      </div>

      <div 
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white w-full h-screen transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
          <div className="flex flex-col h-full bg-white text-gray-800">
              <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p-5 cursor-pointer border-b border-gray-100 hover:bg-gray-50 bg-white">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="back" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">Back</p>
              </div>

              <div className="flex flex-col p-4 gap-2 bg-white">
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/'>HOME</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/collection'>MEDICINES</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/about'>ABOUT</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/contact'>CONTACT</NavLink>
              </div>

              <div className="mt-auto p-8 flex justify-center opacity-40 bg-white">
                 <img src={assets.logo} className="w-32 grayscale" alt="Logo" />
              </div>
          </div>
      </div>
    </div>
  );
};

export default Navbar;