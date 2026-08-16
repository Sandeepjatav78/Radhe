import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { setShowSearch, getCartCount, setToken, token, setCartItems } = useContext(ShopContext);
  
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("cartData");
      setToken("");
      setCartItems({});
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("cartData");
      setToken("");
      setCartItems({});
      navigate("/login");
    }
  };

  const desktopLinks = [
    { label: "HOME", to: "/" },
    { label: "MEDICINES", to: "/collection" },
    { label: "ABOUT", to: "/about" },
    { label: "CONTACT", to: "/contact" },
  ];

  return (
    <>
      {/* =======================================
          TOP BAR (Swiggy Style)
          ======================================= */}
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 max-w-[1440px] mx-auto">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={assets.logo} className="h-8 sm:h-10 w-auto object-contain" alt="Radhe Pharmacy" />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <ul className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-gray-700">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-brand font-bold" : "hover:text-brand"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </ul>

          {/* SEARCH (Desktop) */}
          <button
            onClick={() => {
              setShowSearch(true);
              navigate('/collection');
            }}
            className="hidden md:flex flex-1 max-w-md mx-6 items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search medicines, salts, categories...
          </button>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* SEARCH (Mobile) */}
            <button
              onClick={() => {
                setShowSearch(true);
                navigate('/collection');
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* CART */}
            <Link to="/cart" className="relative w-9 h-9 hidden sm:flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => token ? setProfileOpen(!profileOpen) : navigate("/login")}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {token && profileOpen && (
                <div className="absolute right-0 pt-3 z-50">
                  <div className="flex flex-col gap-1 w-44 py-2 px-2 bg-white text-gray-600 rounded-xl shadow-xl border border-gray-100 text-sm">
                    <p onClick={()=>{navigate('/profile'); setProfileOpen(false);}} className="cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-brand transition">👤 My Profile</p>
                    <p onClick={()=>{navigate('/orders'); setProfileOpen(false);}} className="cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-brand transition">📦 My Orders</p>
                    <p onClick={()=>{navigate('/wishlist'); setProfileOpen(false);}} className="cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-brand transition">❤️ Wishlist</p>
                    <hr className="border-gray-100 my-1" />
                    <p onClick={logout} className="cursor-pointer px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition">🚪 Logout</p>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* =======================================
          MOBILE MENU (Full Screen Drawer)
          ======================================= */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 bg-white w-full h-screen transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full bg-white text-gray-800">
          <div onClick={()=>setMobileMenuOpen(false)} className="flex items-center gap-4 p-5 cursor-pointer border-b border-gray-100 hover:bg-gray-50">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
              <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="back" />
            </div>
            <p className="text-lg font-semibold text-gray-800">Menu</p>
          </div>

          <div className="p-6 border-b border-gray-100">
            {token ? (
              <div className="flex flex-col gap-3">
                <p className="text-lg font-bold text-gray-800">Welcome Back!</p>
                <div className="flex gap-3">
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }} className="flex-1 bg-brand text-white px-4 py-2.5 rounded-xl font-semibold shadow-md">👤 Profile</button>
                  <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex-1 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-medium border border-red-100">🚪 Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full bg-brand text-white font-bold py-3 rounded-xl shadow-lg">Login / Sign Up</button>
            )}
          </div>

          <div className="flex flex-col p-4 gap-2 bg-white">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                onClick={()=>setMobileMenuOpen(false)}
                className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-brand bg-brand-light border-brand/20 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink onClick={()=>setMobileMenuOpen(false)} className={({isActive}) => `py-3 pl-6 border rounded-lg text-lg ${isActive ? 'text-brand bg-brand-light border-brand/20 font-bold' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} to='/wishlist'>❤️ Wishlist</NavLink>
          </div>

          <div className="mt-auto p-8 flex justify-center opacity-40 bg-white">
            <img src={assets.logo} className="w-32 grayscale" alt="Logo" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;