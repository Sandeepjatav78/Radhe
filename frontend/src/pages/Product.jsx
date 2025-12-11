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
  const navigate = useNavigate();

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  if (!productData)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Loading Medicine Details...
      </div>
    );

  const handleBuyNow = () => {
    if (!token) {
      toast.error("Please login to buy medicine");
      return;
    }
    // Size check removed
    navigate("/place-order", { state: { product: productData } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Product Section */}
      <div className="flex flex-col sm:flex-row gap-12">
        
        {/* --- Product Images --- */}
        <div className="flex flex-1 flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-1/5">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                className={`w-20 h-20 object-contain border cursor-pointer p-2 rounded ${
                  image === item ? "border-emerald-500" : "border-gray-200"
                }`}
                alt="thumbnail"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center p-4">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
        </div>

        {/* --- Product Info --- */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Brand & Name */}
          <div>
              <p className="text-sm text-emerald-700 font-medium mb-1">
                  {productData.manufacturer || "Generic Medicine"}
              </p>
              <h1 className="text-3xl font-bold text-gray-800">{productData.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400 text-sm">
                ★★★★☆
            </div>
            <span className="ml-2 text-gray-500 text-sm">(122 Reviews)</span>
          </div>

          {/* Price & Pack Size */}
          <div className="mt-2">
              <p className="text-3xl font-bold text-gray-900">
                {currency}{productData.price}
                <span className="text-base font-normal text-gray-500 ml-2">
                    / {productData.packSize || "Unit"}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Pharmacy Details Box */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg mt-2">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Salt Composition</p>
             <p className="text-gray-700 font-medium">{productData.saltComposition || "Composition not available"}</p>
             
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-3">Product Introduction</p>
             <p className="text-sm text-gray-600 leading-relaxed">{productData.description}</p>
          </div>

          {/* Prescription Warning Badge */}
          {productData.prescriptionRequired && (
            <div className="flex items-start gap-3 bg-red-50 p-3 rounded-md border border-red-100 mt-2">
                <span className="text-xl">⚠️</span>
                <div>
                    <p className="text-red-700 font-bold text-sm">Prescription Required</p>
                    <p className="text-red-600 text-xs">Please upload a valid doctor's prescription at checkout.</p>
                </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                if (!token) {
                  toast.error("Please login to add medicines", { autoClose: 2000 });
                  return;
                }
                // --- Updated: No Size Parameter Passed ---
                addToCart(productData._id);
                toast.success("Medicine added to cart!", { autoClose: 2000 });
              }}
              className="flex-1 bg-gray-900 text-white py-3.5 px-8 rounded-full hover:bg-gray-800 transition-colors font-medium shadow-md"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-emerald-600 text-white py-3.5 px-8 rounded-full hover:bg-emerald-700 transition-colors font-medium shadow-md"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Policies */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-500 border-t pt-6">
            <div className="flex items-center gap-2">
                <img src={assets.quality_icon} className="w-5 grayscale opacity-60" alt="" />
                <p>100% Genuine</p>
            </div>
            <div className="flex items-center gap-2">
                <img src={assets.exchange_icon} className="w-5 grayscale opacity-60" alt="" />
                <p>Safe Delivery</p>
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-lg grayscale opacity-60">🛡️</span>
                <p>Secure Payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Safety Info */}
      <div className="mt-16 bg-white border rounded-xl overflow-hidden">
        <div className="flex border-b bg-gray-50">
          <button className="px-6 py-4 font-semibold text-gray-800 border-b-2 border-emerald-600 bg-white">
            Safety Advice & Uses
          </button>
          <button className="px-6 py-4 text-gray-500 hover:text-gray-700">Reviews (122)</button>
        </div>
        <div className="p-8 text-gray-600 space-y-4 text-sm leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-800 mb-1">Alcohol</h4>
            <p>Caution is advised when consuming alcohol with this medicine. Please consult your doctor.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">Pregnancy & Breastfeeding</h4>
            <p>Information regarding the use of this medicine during pregnancy is not available. Please consult your doctor.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">Storage</h4>
            <p>Store below 30°C. Keep out of reach of children.</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;