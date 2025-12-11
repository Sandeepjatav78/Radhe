import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  
  // Renamed for clarity, but logic remains same
  const [category, setCategory] = useState([]); 
  const [subCategory, setSubCategory] = useState([]); 
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      const regex = new RegExp(`\\b${search.toLowerCase()}\\b`);
      productsCopy = productsCopy.filter((item) =>
        regex.test(item.name.toLowerCase()) || 
        (item.saltComposition && item.saltComposition.toLowerCase().includes(search.toLowerCase())) // Added Salt Search
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showFilter, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      
      {/* --- Filter Options Left Side --- */}
      <div className="min-w-60">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform duration-300 ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Filter 1: Type (Tablet, Syrup etc) */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">MEDICINE TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Tablet', 'Syrup', 'Injection', 'Cream', 'Drops'].map((type) => (
               <label key={type} className="flex gap-2 items-center">
                <input className="w-3" type="checkbox" value={type} onChange={toggleCategory} />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Filter 2: Health Concern (Pain, Cold etc) */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">HEALTH CONCERN</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
             {['Pain Relief', 'Gastric', 'Cold & Cough', 'Vitamins', 'Antibiotic'].map((sub) => (
               <label key={sub} className="flex gap-2 items-center">
                <input className="w-3" type="checkbox" value={sub} onChange={toggleSubCategory} />
                {sub}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* --- Right Side: Product Grid --- */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"MEDICINES"} />
          {/* Sorting */}
          <select
            onClick={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High To Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
             filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                // Passing Pharmacy Props
                salt={item.saltComposition}
                packSize={item.packSize}
                isRx={item.prescriptionRequired}
              />
            ))
          ) : (
             <p className="col-span-full text-center text-gray-500 text-lg">
                No medicines found matching filters.
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;