import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Profile from "./pages/Profile";
import Verify from "./pages/Verify";
import ScrollToTop from './components/ScrollToTop';
import SiteInfoBanner from "./components/SiteInfoBanner";

import { ToastContainer, Slide } from "react-toastify"; // ✅ Slide transition
import 'react-toastify/dist/ReactToastify.css';

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ReturnPolicy from './pages/ReturnPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import PrescriptionPolicy from './pages/PrescriptionPolicy';
import GrievanceRedressal from './pages/GrievanceRedressal';

const App = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <SearchBar />
      
      {/* Site Info Banner */}
      <SiteInfoBanner /> 
      
      {/* ✅ ROUNDED PILL DESIGN TOAST CONFIGURATION */}
      <ToastContainer 
        position="top-right" 
        autoClose={2500} 
        hideProgressBar={true} 
        newestOnTop={true} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss={false} 
        draggable 
        pauseOnHover={false} 
        theme="light"
        transition={Slide} 
        limit={2}
        
        // 🎨 Tailwind Custom Styling - PERFECT ROUNDED PILL SHAPE
        toastClassName="mt-16 sm:mt-20 mr-4 sm:mr-6 relative flex px-4 py-3 rounded-full overflow-hidden cursor-pointer shadow-[0_3px_15px_rgb(0,0,0,0.1)] bg-white border border-gray-100 w-max max-w-[85vw] sm:max-w-md ml-auto text-sm font-medium text-gray-800 transition-all items-center"
        bodyClassName="flex items-center gap-2 m-0 p-0"
      />

      <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[6vw]">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />

          {/* Legal Policy Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/prescription-policy" element={<PrescriptionPolicy />} />
          <Route path="/grievance-redressal" element={<GrievanceRedressal />} />
        </Routes>
        
        <Footer />
      </div>
      
    </div>
  );
};

export default App;