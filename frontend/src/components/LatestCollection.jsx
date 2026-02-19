import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "../components/ProductSkeleton"; 
import { motion } from "framer-motion";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setLatestProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    if (products && products.length > 0) {
        // 1. slice() creates a copy
        // 2. reverse() makes newest appear first
        // 3. slice(0, 10) takes the top 10
        setLatestProduct(products.slice().reverse().slice(0, 10));
        setLoading(false);
    }
  }, [products]);

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gray-700">NEW</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            ARRIVALS
          </span>
        </motion.h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Latest medicines and healthcare products added to our inventory.
        </p>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6"
      >
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <ProductItemSkeleton key={i} />)
          : latestProduct.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* --- PASS VARIANTS HERE --- */}
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  
                  // Keep these as fallbacks for old products
                  price={item.price}
                  mrp={item.mrp} 
                  packSize={item.packSize}
                  
                  // Pharmacy Specific Data
                  salt={item.saltComposition}
                  isRx={item.prescriptionRequired}
                  
                  // ✅ IMPORTANT: Pass Variants Array
                  variants={item.variants} 
                />
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

export default LatestCollection;