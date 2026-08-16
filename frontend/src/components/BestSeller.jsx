import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import ProductSkeleton from "./ProductSkeleton";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (products && products.length > 0) {
      const filtered = products.filter((item) => item.bestsellar);
      setBestSeller(filtered.slice(0, 8));
      setLoading(false);
    }
  }, [products]);

  return (
    <div className="py-6 sm:py-10">
      <div className="flex items-center justify-between mb-3 sm:mb-6 px-1">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Most trusted and frequently purchased essentials
          </p>
        </div>
        <Link
          to="/collection"
          className="text-brand font-semibold text-xs sm:text-sm flex items-center gap-1 hover:underline flex-shrink-0"
        >
          See All
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar sm:hidden pb-2 -mx-4 px-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-40 flex-shrink-0"><ProductSkeleton /></div>
            ))
          : bestSeller.map((item, index) => (
              <div key={item._id || index} className="w-40 flex-shrink-0">
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  mrp={item.mrp}
                  packSize={item.packSize}
                  salt={item.saltComposition}
                  isRx={item.prescriptionRequired}
                  variants={item.variants}
                />
              </div>
            ))}
      </div>

      <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => <ProductSkeleton key={idx} />)
          : bestSeller.map((item, index) => (
              <ProductItem
                key={item._id || index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                mrp={item.mrp}
                packSize={item.packSize}
                salt={item.saltComposition}
                isRx={item.prescriptionRequired}
                variants={item.variants}
              />
            ))}
      </div>
    </div>
  );
};

export default BestSeller;