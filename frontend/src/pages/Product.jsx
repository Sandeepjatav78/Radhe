import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import ReviewSection from "../components/ReviewSection";
import DrugInteractionChecker from "../components/DrugInteractionChecker";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [activeVariant, setActiveVariant] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const defaultSafetyAdvice = {
      alcohol: "Unsafe. It is advisable not to consume alcohol along with this medicine.",
      pregnancy: "Consult your doctor. Limited data available regarding use during pregnancy.",
      breastfeeding: "Caution advised. Please consult your doctor before use.",
      driving: "May cause dizziness. Avoid driving or operating heavy machinery.",
      kidney: "Caution required. Dose adjustment may be needed. Consult your doctor.",
      liver: "Consult your doctor. Limited information available."
  };

  useEffect(() => {
    console.log(`[Product] ProductID: ${productId}`);
    console.log(`[Product] Total products available: ${products.length}`);
    
    if (!productId) {
      console.warn('[Product] No productId in URL params');
      return;
    }

    const product = products.find((item) => item._id === productId);
    
    if (product) {
      console.log(`[Product] ✅ Found product:`, product.name);
      setProductData(product);
      setImage(product.image[0]);
      if (product.variants && product.variants.length > 0) {
          setActiveVariant(product.variants[0]);
      }
    } else {
      console.warn(`[Product] ❌ Product not found in array. Searched for ID: ${productId}`);
      console.log(`[Product] Available IDs:`, products.map(p => p._id).slice(0, 5));
    }
  }, [productId, products]);

  const changeImage = (newImg, dir) => {
      setDirection(dir);
      setImage(newImg);
  };

  // --- SWIPE HANDLERS ---
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
        const currentIndex = productData.image.indexOf(image);
        let nextIndex;

        if (isLeftSwipe) {
            nextIndex = (currentIndex + 1) % productData.image.length;
            changeImage(productData.image[nextIndex], 1);
        } else {
            nextIndex = (currentIndex - 1 + productData.image.length) % productData.image.length;
            changeImage(productData.image[nextIndex], -1);
        }
    }
  };

  const slideVariants = {
      enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
      center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
      exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } })
  };

  if (!productData) {
    // If products array is empty, still loading
    if (products.length === 0) {
      return <div className="min-h-[70vh] flex items-center justify-center text-gray-500 animate-pulse">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading product...</div>
          <div className="text-sm">Please wait</div>
        </div>
      </div>;
    }
    
    // Products loaded but product not found
    return <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-bold text-red-600 mb-4">Product Not Found</div>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>;
  }
  
  if (!activeVariant) return <div className="min-h-[70vh] flex items-center justify-center text-gray-500 animate-pulse">Loading variants...</div>;

  const currentPrice = activeVariant.price;
  const currentMrp = activeVariant.mrp;
  const currentSize = activeVariant.size;
  const currentStock = activeVariant.stock;
  const discount = currentMrp > currentPrice ? Math.floor(((currentMrp - currentPrice) / currentMrp) * 100) : 0;
  const safety = { ...defaultSafetyAdvice, ...productData.safety_advice };

  return (
    // ✅ MOBILE FIX: mt-4 instead of mt-8 for mobile
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8 mb-24 sm:mb-20">
      
      <div className="flex flex-col md:flex-row gap-6 sm:gap-10 lg:gap-16">
        
        {/* ================= LEFT: Images Section ================= */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
          
          {/* Thumbnails (Horizontal Scroll on Mobile) */}
          <div className="flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto md:w-[15%] justify-start scrollbar-hide pb-1 md:pb-0">
            {productData.image.map((item, index) => (
              <img 
                key={index} 
                src={item} 
                onClick={() => changeImage(item, index > productData.image.indexOf(image) ? 1 : -1)} 
                // ✅ MOBILE FIX: Smaller thumbnails (w-14) for mobile, bigger (w-20) for desktop
                className={`w-14 h-14 min-w-[56px] sm:min-w-0 sm:w-20 sm:h-20 object-contain cursor-pointer rounded-lg border-2 p-1 transition-all brightness-105 ${image === item ? "border-emerald-500 bg-emerald-50" : "border-transparent bg-gray-50 hover:border-gray-200"}`} 
                alt={`thumb-${index}`} 
              />
            ))}
          </div>

          {/* MAIN IMAGE CAROUSEL */}
          <div 
            onClick={() => setShowImageModal(true)}
            // ✅ MOBILE FIX: Fixed height h-[280px] on mobile so it fits the screen perfectly without shifting
            className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-4 sm:p-6 relative shadow-sm h-[280px] sm:h-[400px] md:h-[450px] touch-pan-y overflow-hidden cursor-pointer group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
              {discount > 0 && <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">{discount}% OFF</span>}
              
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Click to zoom</span>
                </div>
              </div>
              
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                    key={image}
                    src={image}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    alt={productData.name}
                    className="w-full h-full max-h-[240px] sm:max-h-[380px] object-contain pointer-events-none select-none brightness-105"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                />
              </AnimatePresence>
              
              <div className="absolute bottom-2 bg-black/5 px-3 py-1 rounded-full text-gray-400 text-[10px] md:hidden flex items-center gap-1">
                <span>←</span> Swipe <span>→</span>
              </div>
          </div>
        </div>

        {/* ================= RIGHT: Product Info ================= */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs sm:text-sm text-emerald-600 font-bold uppercase tracking-wider mb-1">{productData.manufacturer || "Generic"}</p>
          
          {/* ✅ MOBILE FIX: Font sizes adapted for mobile (text-xl vs text-3xl) */}
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">{productData.name}</h1>
          
          {productData.saltComposition && productData.saltComposition.trim() !== "" && (
              <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
                  Salt: <span className="text-gray-700">{productData.saltComposition}</span>
              </p>
          )}

          <div className="flex items-center gap-2 mt-2 sm:mt-3 mb-3 sm:mb-4"><div className="flex text-amber-400 text-sm">★★★★☆</div><p className="text-[11px] sm:text-xs text-gray-400">(122 Verified Reviews)</p></div>
          <hr className="border-gray-100 mb-4 sm:mb-5" />

          {/* PRICE SECTION */}
          <div className="flex flex-col gap-0.5">
              <div className="flex items-end gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{currency}{currentPrice}</span>
                  {discount > 0 && <span className="text-sm sm:text-lg text-gray-400 line-through mb-1">MRP {currency}{currentMrp}</span>}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500">Inclusive of all taxes • Pack Size: <span className="font-semibold text-gray-700">{currentSize}</span></p>
          </div>

          {/* VARIANTS */}
          <div className="mt-5 sm:mt-6">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2.5">Select Pack Size:</p>
              <div className="flex flex-wrap gap-2.5">
                  {productData.variants.map((variant, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveVariant(variant)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                            activeVariant.size === variant.size 
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600" 
                            : "border-gray-200 text-gray-600 hover:border-emerald-300"
                        }`}
                      >
                          {variant.size}
                      </button>
                  ))}
              </div>
          </div>

          {productData.prescriptionRequired && (
            <div className="flex items-center gap-2.5 bg-red-50 p-2.5 sm:p-3 rounded-lg border border-red-100 mt-5">
                <div className="bg-red-100 p-1 rounded-full"><span className="text-sm sm:text-lg">⚠️</span></div>
                <div><p className="text-red-700 font-bold text-xs sm:text-sm">Prescription Required</p><p className="text-red-600 text-[10px] sm:text-xs mt-0.5">Please upload Rx at checkout.</p></div>
            </div>
          )}

          {/* --- ACTION BUTTONS --- */}
          {/* ✅ MOBILE FIX: Taller button (py-3.5) for easy thumb tapping */}
          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
             {currentStock > 0 ? (
                <button 
                    onClick={() => { 
                        if (!token) { 
                            toast.error("Please login to add to cart");
                            navigate('/login', { state: { from: location.pathname } }); 
                            return; 
                        } 
                        addToCart(productData._id, currentSize); 
                    }} 
                    className="flex-1 bg-black text-white py-3.5 sm:py-4 px-6 rounded-xl hover:bg-gray-800 transition-transform active:scale-95 text-sm sm:text-base font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                    Add to Cart
                </button>
             ) : (
                <button disabled className="flex-1 bg-gray-300 text-gray-500 py-3.5 sm:py-4 px-6 rounded-xl text-sm sm:text-base font-bold cursor-not-allowed">
                    Out of Stock
                </button>
             )}
          </div>
          
          {/* ✅ MOBILE FIX: Better icon scaling for small screens */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 text-center">
             <div className="flex flex-col items-center gap-1 p-1.5 sm:p-2 bg-gray-50 rounded-lg"><img src={assets.quality_icon} className="w-5 h-5 sm:w-6 sm:h-6 opacity-70" alt="" /><p className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Genuine</p></div>
             <div className="flex flex-col items-center gap-1 p-1.5 sm:p-2 bg-gray-50 rounded-lg"><img src={assets.exchange_icon} className="w-5 h-5 sm:w-6 sm:h-6 opacity-70" alt="" /><p className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Fast</p></div>
             <div className="flex flex-col items-center gap-1 p-1.5 sm:p-2 bg-gray-50 rounded-lg"><span className="text-lg sm:text-xl opacity-70">🛡️</span><p className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Secure</p></div>
          </div>
        </div>
      </div>

      {/* ================= TABS & SAFETY ================= */}
      <div className="mt-12 sm:mt-16">
        <div className="flex gap-4 sm:gap-6 border-b border-gray-200">
           <button onClick={() => setActiveTab("description")} className={`pb-2.5 sm:pb-3 border-b-2 font-bold text-xs sm:text-base transition-colors cursor-pointer ${activeTab === "description" ? "border-emerald-600 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Description</button>
           <button onClick={() => setActiveTab("safety")} className={`pb-2.5 sm:pb-3 border-b-2 font-bold text-xs sm:text-base transition-colors cursor-pointer ${activeTab === "safety" ? "border-emerald-600 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Safety Advice</button>
        </div>
        
        <div className="py-5 sm:py-6 text-gray-600 text-xs sm:text-sm leading-6 sm:leading-7 space-y-4">
           {activeTab === "description" ? (
             <p className="whitespace-pre-wrap px-1">{productData.description}</p>
           ) : (
             // ✅ MOBILE FIX: P-3 padding on mobile instead of P-4 so items don't look bulky.
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-2 sm:mt-4">
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-100 flex gap-3 sm:gap-4"><div className="text-xl sm:text-2xl">🍷</div><div><h4 className="font-bold text-gray-800 mb-0.5">Alcohol</h4><p className="text-[11px] sm:text-xs text-gray-600">{safety.alcohol}</p></div></div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100 flex gap-3 sm:gap-4"><div className="text-xl sm:text-2xl">🤰</div><div><h4 className="font-bold text-gray-800 mb-0.5">Pregnancy</h4><p className="text-[11px] sm:text-xs text-gray-600">{safety.pregnancy}</p></div></div>
                <div className="bg-pink-50 p-3 sm:p-4 rounded-lg border border-pink-100 flex gap-3 sm:gap-4"><div className="text-xl sm:text-2xl">🤱</div><div><h4 className="font-bold text-gray-800 mb-0.5">Breastfeeding</h4><p className="text-[11px] sm:text-xs text-gray-600">{safety.breastfeeding}</p></div></div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 flex gap-3 sm:gap-4"><div className="text-xl sm:text-2xl">🚗</div><div><h4 className="font-bold text-gray-800 mb-0.5">Driving</h4><p className="text-[11px] sm:text-xs text-gray-600">{safety.driving}</p></div></div>
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100 flex gap-3 sm:gap-4"><div className="text-xl sm:text-2xl">🫘</div><div><h4 className="font-bold text-gray-800 mb-0.5">Kidney</h4><p className="text-[11px] sm:text-xs text-gray-600">{safety.kidney}</p></div></div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-100 flex gap-3 sm:gap-4"><div className="text-xl sm:text-2xl">🩺</div><div><h4 className="font-bold text-gray-800 mb-0.5">Liver</h4><p className="text-[11px] sm:text-xs text-gray-600">{safety.liver}</p></div></div>
             </div>
           )}
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} productId={productData._id} />

      {/* ================= NEW FEATURES ================= */}
      <DrugInteractionChecker />
      <ReviewSection productId={productData._id} />

      {/* ================= IMAGE ZOOM MODAL ================= */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 z-[1001] bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Main Zoomable Image */}
          <div 
            className="relative w-full h-full max-w-4xl max-h-screen flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={image}
              alt={productData.name}
              className="w-full h-full object-contain cursor-zoom-in"
              style={{ scale: zoomLevel }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-full z-[1001]">
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-all"
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            <div className="flex items-center gap-2 px-3 min-w-[100px] justify-center">
              <span className="text-white text-sm font-bold">{(zoomLevel * 100).toFixed(0)}%</span>
            </div>

            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-all"
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>

            <button
              onClick={() => setZoomLevel(1)}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2.5 rounded-full transition-all text-sm font-medium"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>

          {/* Thumbnail Strip at Bottom */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg z-[1001] scrollbar-hide overflow-x-auto max-w-sm">
            {productData.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setImage(img)}
                className={`h-12 w-12 object-contain rounded cursor-pointer border-2 transition-all ${
                  image === img ? 'border-emerald-400' : 'border-gray-600 opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          {/* Navigation Info */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm z-[1001]">
            Click and drag to pan • Scroll to zoom
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;