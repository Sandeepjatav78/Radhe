import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "../components/ProductSkeleton";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setLatestProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (products && products.length > 0) {
      setLatestProduct(products.slice().reverse().slice(0, 10));
      setLoading(false);
    }
  }, [products]);

  return (
    <div className="py-6 sm:py-10">
      <div className="flex items-center justify-between mb-3 sm:mb-6 px-1">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            New Arrivals
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Latest medicines added to our store
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

      {/* Mobile: horizontal scroll | Desktop: grid */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar sm:hidden pb-2 -mx-4 px-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-40 flex-shrink-0"><ProductItemSkeleton /></div>
            ))
          : latestProduct.map((item, index) => (
              <div key={index} className="w-40 flex-shrink-0">
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
          ? Array.from({ length: 10 }).map((_, i) => <ProductItemSkeleton key={i} />)
          : latestProduct.map((item, index) => (
              <ProductItem
                key={index}
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

export default LatestCollection;