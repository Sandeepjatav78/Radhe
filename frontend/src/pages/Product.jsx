import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();

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
    }
  }, [productId, products]);

  if (!productData) return <div className="min-h-[70vh] flex items-center justify-center text-gray-500 animate-pulse">Loading...</div>;

  const discount = productData.mrp && productData.price && productData.mrp > productData.price
    ? Math.floor(((productData.mrp - productData.price) / productData.mrp) * 100) : 0;

  const safety = { ...defaultSafetyAdvice, ...productData.safety_advice };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-20 transition-opacity opacity-100 duration-500">
      
      {/* --- Main Product Section --- */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        
        {/* LEFT: Images */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-[15%] justify-start md:justify-start scrollbar-hide">
            {productData.image.map((item, index) => (
              <img key={index} src={item} onClick={() => setImage(item)} className={`w-16 h-16 md:w-20 md:h-20 object-contain cursor-pointer rounded-lg border-2 p-1 transition-all ${image === item ? "border-emerald-500 bg-emerald-50" : "border-transparent bg-gray-50 hover:border-gray-200"}`} alt={`thumb-${index}`} />
            ))}
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-6 relative shadow-sm min-h-[300px] md:min-h-[450px]">
             {discount > 0 && <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">{discount}% OFF</span>}
            <img src={image} alt={productData.name} className="w-full h-full max-h-[400px] object-contain hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-1">{productData.manufacturer || "Generic"}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{productData.name}</h1>
          
          {/* --- CHANGE 1: SALT CHECK (Sirf tab dikhega jab value ho) --- */}
          {productData.saltComposition && productData.saltComposition.trim() !== "" && (
              <p className="text-gray-500 text-sm mt-2 font-medium">
                  Salt: <span className="text-gray-700">{productData.saltComposition}</span>
              </p>
          )}

          <div className="flex items-center gap-2 mt-3 mb-4"><div className="flex text-amber-400 text-sm">★★★★☆</div><p className="text-xs text-gray-400">(122 Verified Reviews)</p></div>
          <hr className="border-gray-100 mb-5" />

          <div className="flex flex-col gap-1">
             <div className="flex items-end gap-3">
                 <span className="text-3xl font-bold text-gray-900">{currency}{productData.price}</span>
                 {discount > 0 && <span className="text-lg text-gray-400 line-through mb-1">MRP {currency}{productData.mrp}</span>}
             </div>
             <p className="text-xs text-gray-500">Inclusive of all taxes • Pack Size: <span className="font-semibold text-gray-700">{productData.packSize}</span></p>
          </div>

          {productData.prescriptionRequired && (
            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100 mt-5">
                <div className="bg-red-100 p-1.5 rounded-full"><span className="text-lg">⚠️</span></div>
                <div><p className="text-red-700 font-bold text-sm">Prescription Required</p><p className="text-red-600 text-xs mt-0.5">Please upload a valid doctor's prescription at checkout.</p></div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button onClick={() => { if (!token) { toast.error("Please login first"); return; } addToCart(productData._id); }} className="flex-1 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-transform active:scale-95 font-semibold shadow-lg">Add to Cart</button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 text-center">
             <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg"><img src={assets.quality_icon} className="w-6 h-6 opacity-70" alt="" /><p className="text-[10px] text-gray-600 font-medium">Genuine</p></div>
             <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg"><img src={assets.exchange_icon} className="w-6 h-6 opacity-70" alt="" /><p className="text-[10px] text-gray-600 font-medium">Fast</p></div>
             <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg"><span className="text-xl opacity-70">🛡️</span><p className="text-[10px] text-gray-600 font-medium">Secure</p></div>
          </div>
        </div>
      </div>

      {/* --- TABS SECTION --- */}
      <div className="mt-16">
        <div className="flex gap-6 border-b border-gray-200">
           {/* --- CHANGE 2: Added 'cursor-pointer' explicitly --- */}
           <button 
             onClick={() => setActiveTab("description")} 
             className={`pb-3 border-b-2 font-bold text-sm sm:text-base transition-colors cursor-pointer ${activeTab === "description" ? "border-emerald-600 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}
           >
             Description
           </button>
           <button 
             onClick={() => setActiveTab("safety")} 
             className={`pb-3 border-b-2 font-bold text-sm sm:text-base transition-colors cursor-pointer ${activeTab === "safety" ? "border-emerald-600 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}
           >
             Safety Advice
           </button>
        </div>

        <div className="py-6 text-gray-600 text-sm leading-7 space-y-4">
           {activeTab === "description" ? (
             <p className="whitespace-pre-wrap">{productData.description}</p>
           ) : (
             <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex gap-4"><div className="text-2xl">🍷</div><div><h4 className="font-bold text-gray-800 mb-1">Alcohol</h4><p className="text-xs text-gray-600">{safety.alcohol}</p></div></div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-4"><div className="text-2xl">🤰</div><div><h4 className="font-bold text-gray-800 mb-1">Pregnancy</h4><p className="text-xs text-gray-600">{safety.pregnancy}</p></div></div>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 flex gap-4"><div className="text-2xl">🤱</div><div><h4 className="font-bold text-gray-800 mb-1">Breastfeeding</h4><p className="text-xs text-gray-600">{safety.breastfeeding}</p></div></div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex gap-4"><div className="text-2xl">🚗</div><div><h4 className="font-bold text-gray-800 mb-1">Driving</h4><p className="text-xs text-gray-600">{safety.driving}</p></div></div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-4"><div className="text-2xl">🫘</div><div><h4 className="font-bold text-gray-800 mb-1">Kidney</h4><p className="text-xs text-gray-600">{safety.kidney}</p></div></div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-4"><div className="text-2xl">🩺</div><div><h4 className="font-bold text-gray-800 mb-1">Liver</h4><p className="text-xs text-gray-600">{safety.liver}</p></div></div>
             </div>
           )}
        </div>
      </div>

      {/* --- CHANGE 3: Passed productId to exclude same item --- */}
      <RelatedProducts 
        category={productData.category} 
        subCategory={productData.subCategory} 
        productId={productData._id} 
      />
    </div>
  );
};

export default Product;