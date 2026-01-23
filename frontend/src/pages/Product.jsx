import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [activeVariant, setActiveVariant] = useState(null);

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
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      if (product.variants && product.variants.length > 0) {
          setActiveVariant(product.variants[0]);
      }
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

  if (!productData || !activeVariant) return <div className="min-h-[70vh] flex items-center justify-center text-gray-500 animate-pulse">Loading...</div>;

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
            // ✅ MOBILE FIX: Fixed height h-[280px] on mobile so it fits the screen perfectly without shifting
            className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-4 sm:p-6 relative shadow-sm h-[280px] sm:h-[400px] md:h-[450px] touch-pan-y overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
              {discount > 0 && <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">{discount}% OFF</span>}
              
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
    </div>
  );
};

export default Product;