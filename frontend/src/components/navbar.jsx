import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { setShowSearch, cartItems, setToken, token, setCartItems, setUserOrders } = useContext(ShopContext);
  const navigate = useNavigate();

  // --- CHANGED: Pharmacy me Size nahi hota, simple quantity sum karo ---
  const getTotalCartItems = () => {
    let total = 0;
    for (const itemId in cartItems) {
       // Backend logic ke hisab se cartItems[itemId] direct quantity number hai
       if (cartItems[itemId] > 0) {
          total += cartItems[itemId];
       }
    }
    return total;
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setUserOrders([]);
  };

  return (
    <div className="sticky sm:px-5 top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex h-16 items-center justify-between py-2 px-4 max-w-[1440px] mx-auto font-medium">
        
        {/* Logo - Text Based for now if image not perfect */}
        <Link to="/" className="flex items-center gap-2">
           <img src={assets.logo} className="h-6 sm:h-8" alt="Radhe Pharmacy" />
           {/* Optional Text Logo if needed */}
           {/* <span className="text-xl font-bold text-emerald-700 tracking-wide">RADHE</span> */}
        </Link>

        {/* Desktop Links */}
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

        {/* Right Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <img onClick={() => setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer hover:opacity-80" alt="Search" />

          <div className="relative group">
            <img onClick={() => token ? setProfileOpen(!profileOpen) : navigate("/login")} src={assets.profile_icon} className="w-5 cursor-pointer hover:opacity-80" alt="Profile" />
            
            {/* Dropdown Menu */}
            {token && profileOpen && (
              <div className="absolute right-0 pt-4 z-50">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-xl border border-gray-100">
                  <p onClick={()=>navigate('/profile')} className="cursor-pointer hover:text-emerald-600 transition">My Profile</p>
                  <p onClick={()=>navigate('/orders')} className="cursor-pointer hover:text-emerald-600 transition">Orders</p>
                  <p onClick={logout} className="cursor-pointer hover:text-emerald-600 transition">Logout</p>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5 hover:opacity-80" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-emerald-600 text-white aspect-square rounded-full text-[8px]">
              {getTotalCartItems()}
            </p>
          </Link>

          <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="Menu" />
        </div>
      </div>

      {/* Mobile Menu logic same as before... */}
      {/* (Code shortened for brevity, keep your existing mobile menu code here) */}
      {visible && (
        <div className="fixed inset-0 z-50 bg-white transition-all">
            <div className="flex flex-col text-gray-600">
                <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                    <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
                    <p>Back</p>
                </div>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/'>HOME</NavLink>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/collection'>MEDICINES</NavLink>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/about'>ABOUT</NavLink>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/contact'>CONTACT</NavLink>
            </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;