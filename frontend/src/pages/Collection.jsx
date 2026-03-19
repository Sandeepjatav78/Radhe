import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import RequestMedicine from "../components/RequestMedicine";
import axios from "axios";
import { getCache, setCache, CACHE_DURATIONS } from "../utils/cacheUtils";

const Collection = () => {
  const { search, showSearch, backendUrl } = useContext(ShopContext);
  const PAGE_SIZE = 20;

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const loadMoreRef = useRef(null);

  // Filter States
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Data States
  const [allCategories, setAllCategories] = useState([]); 
  const [expandedCategories, setExpandedCategories] = useState([]);

  // --- 1. HARDCODED DEFAULTS ---
  const defaultCategoryData = {
      "Tablet": ["Pain Relief", "Gastric", "Antibiotic", "Vitamins", "Cold & Cough", "Heart", "Other"],
      "Syrup": ["Cough Syrup", "Digestion", "Multivitamin", "Antacid", "Other"],
      "Injection": ["Pain Killer", "Antibiotic", "Diabetes", "Vaccine", "Other"],
      "Cream": ["Antifungal", "Antibiotic", "Pain Relief", "Moisturizer", "Skin Care", "Other"],
      "Drops": ["Eye Drops", "Ear Drops", "Pediatric Drops", "Other"],
      "Sexual Wellness": ["Condoms", "Lubricants", "Performance Supplements", "Test Kits", "Hygiene", "Other"],
      "Devices": ["BP Monitor", "Glucometer", "Thermometer", "Oximeter", "Other"],
      "Health & Nutrition": ["Daily Supplements", "Protein Supplements", "Weight Management", "Energy Drinks", "Multivitamins", "Other"],
      "Other": []
  };

  // --- 2. FETCH & MERGE DATA (with Local Storage Cache) ---
  useEffect(() => {
    const fetchAndMergeCategories = async () => {
      try {
        // Check cache first
        const cachedCategories = getCache('categoriesCache', CACHE_DURATIONS.MEDIUM);
        if (cachedCategories) {
          setAllCategories(cachedCategories);
          return;
        }
        
        // If cache miss, fetch and merge
        let mergedList = Object.keys(defaultCategoryData).map(key => ({
            name: key,
            subCategories: defaultCategoryData[key]
        }));

        const response = await axios.get(backendUrl + "/api/product/categories");
        if (response.data.success) {
            const dbCats = response.data.categories;
            dbCats.forEach(dbCat => {
                const existingIndex = mergedList.findIndex(item => item.name === dbCat.name);
                if (existingIndex !== -1) {
                    const combinedSubs = new Set([...mergedList[existingIndex].subCategories, ...dbCat.subCategories]);
                    mergedList[existingIndex].subCategories = Array.from(combinedSubs);
                } else {
                    mergedList.push(dbCat);
                }
            });
        }
        
        setAllCategories(mergedList);
        setCache('categoriesCache', mergedList);
        
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchAndMergeCategories();
  }, [backendUrl]);

  // --- 3. LOGIC HANDLERS ---
  
  const toggleExpand = (catName) => {
      if (expandedCategories.includes(catName)) {
          setExpandedCategories(prev => prev.filter(item => item !== catName)); 
      } else {
          setExpandedCategories(prev => [...prev, catName]);
      }
  };

  const toggleCategoryFilter = (catName) => {
      if (category.includes(catName)) {
          setCategory(prev => prev.filter(item => item !== catName));
      } else {
          setCategory(prev => [...prev, catName]);
      }
  };

  const toggleSubCategory = (subName) => {
      if (subCategory.includes(subName)) {
          setSubCategory(prev => prev.filter(item => item !== subName));
      } else {
          setSubCategory(prev => [...prev, subName]);
      }
  };

  // ✅ NEW: CLEAR FILTERS FUNCTION
  const clearFilters = () => {
      setCategory([]);
      setSubCategory([]);
      setExpandedCategories([]); // Close all dropdowns
      setSortType("relevant");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = async (targetPage, shouldReset = false) => {
    if (isLoadingProducts) return;

    try {
      setIsLoadingProducts(true);

      const params = {
        page: targetPage,
        limit: PAGE_SIZE,
      };

      const effectiveSearch = showSearch ? debouncedSearch : "";
      if (effectiveSearch) params.search = effectiveSearch;
      if (category.length > 0) params.category = category.join(",");
      if (subCategory.length > 0) params.subCategory = subCategory.join(",");
      if (sortType === "low-high") params.sort = "low-high";
      if (sortType === "high-low") params.sort = "high-low";

      const response = await axios.get(backendUrl + "/api/product/list", { params });

      if (!response.data.success) {
        setHasMore(false);
        return;
      }

      const incomingProducts = response.data.products || [];

      if (shouldReset) {
        setFilterProducts(incomingProducts);
      } else {
        setFilterProducts((prev) => {
          const seenIds = new Set(prev.map((item) => item._id));
          const uniqueIncoming = incomingProducts.filter((item) => !seenIds.has(item._id));
          return [...prev, ...uniqueIncoming];
        });
      }

      const totalPages = Number(response.data.totalPages || 1);
      setHasMore(targetPage < totalPages);
      setIsInitialLoadDone(true);
    } catch (error) {
      console.error("Failed to fetch paginated products", error);
      setHasMore(false);
      setIsInitialLoadDone(true);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [debouncedSearch, showSearch, category, subCategory, sortType, backendUrl]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page, false);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoadingProducts) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "250px",
        threshold: 0,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [hasMore, isLoadingProducts]);

  // Check if any filter is active to show the Clear button
  const isFilterActive = category.length > 0 || subCategory.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 pt-4 sm:pt-10 pb-20 sm:pb-10">
      
      {/* --- LEFT SIDE: FILTERS --- */}
      <div className="min-w-60">
        
        {/* Header with Clear Button */}
        <div className="flex items-center justify-between my-2">
            <p
            className="text-xl flex items-center cursor-pointer gap-2"
            onClick={() => setShowFilter(!showFilter)}
            >
            FILTERS
            <img className={`h-3 sm:hidden transition-transform ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon} alt="" />
            </p>

            {/* ✅ CLEAR FILTER BUTTON (Visible Only When Filters Active) */}
            {isFilterActive && (
                <button 
                    onClick={clearFilters}
                    className="text-xs text-red-500 font-medium hover:text-red-700 underline transition-colors cursor-pointer mr-2"
                >
                    Clear All
                </button>
            )}
        </div>

        <div className={`border border-gray-300 p-5 mt-6 ${showFilter ? "" : "hidden"} sm:block bg-white rounded-lg shadow-sm`}>
          <p className="mb-4 text-sm font-bold text-gray-800">CATEGORIES</p>
          
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            {allCategories.length > 0 ? (
                allCategories.map((cat, index) => {
                  const isOpen = expandedCategories.includes(cat.name);
                  const isCatActive = category.includes(cat.name);

                  return (
                    <div key={index} className="flex flex-col">
                      
                      {/* --- Parent Category Row --- */}
                      <div 
                        onClick={() => toggleExpand(cat.name)}
                        className={`flex items-center justify-between p-2.5 rounded cursor-pointer transition-colors border-b border-transparent hover:bg-gray-50
                            ${isOpen ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-600'}
                        `}
                      >
                          <span className="flex-1">{cat.name}</span>
                          <img 
                            src={assets.dropdown_icon} 
                            alt="" 
                            className={`h-2.5 w-2.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                          />
                      </div>

                      {/* --- Dropdown List --- */}
                      {isOpen && (
                          <div className="flex flex-col gap-1 bg-gray-50/50 pb-2 mb-2 rounded-b-lg">
                              
                              {/* Option 1: ALL [Category] */}
                              <p 
                                  onClick={() => toggleCategoryFilter(cat.name)}
                                  className={`cursor-pointer px-4 py-1.5 text-xs transition-colors flex items-center gap-2
                                      ${isCatActive ? 'text-emerald-600 font-bold bg-white shadow-sm' : 'text-gray-500 hover:text-emerald-600'}
                                  `}
                              >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isCatActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                  All {cat.name}s
                              </p>

                              {/* Option 2: Sub-Categories */}
                              {cat.subCategories.map((sub, subIndex) => {
                                  const isSubSelected = subCategory.includes(sub);
                                  return (
                                    <p 
                                        key={subIndex} 
                                        onClick={() => toggleSubCategory(sub)}
                                        className={`cursor-pointer px-4 py-1.5 text-xs transition-colors pl-8
                                            ${isSubSelected ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-900'}
                                        `}
                                    >
                                        {sub}
                                    </p>
                                  )
                              })}
                          </div>
                      )}
                    </div>
                  );
                })
            ) : (
                <p className="text-xs text-gray-400">Loading...</p>
            )}
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: PRODUCTS --- */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4 px-2 sm:px-0">
          <Title text1={"ALL"} text2={"MEDICINES"} />
          <select onChange={(e) => setSortType(e.target.value)} value={sortType} className="border-2 border-gray-300 text-sm px-2 py-1 rounded outline-emerald-500">
            <option value="relevant">Sort By: Newest First</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High To Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 gap-y-3 sm:gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price} 
                mrp={item.mrp}
                image={item.image}
                salt={item.saltComposition}
                packSize={item.packSize}
                variants={item.variants} 
                isRx={item.prescriptionRequired}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center w-full">
               {isLoadingProducts && !isInitialLoadDone ? (
                 <p className="text-gray-500 text-lg mt-4 mb-4 text-center">Loading medicines...</p>
               ) : (
                 <>
               <p className="text-gray-500 text-lg mt-4 mb-4 text-center">No medicines found matching your search.</p>
               <RequestMedicine />
                 </>
               )}
            </div>
          )}
        </div>

        <div ref={loadMoreRef} className="h-12 flex items-center justify-center">
          {isLoadingProducts && filterProducts.length > 0 && (
            <p className="text-sm text-gray-500">Loading more medicines...</p>
          )}
          {!hasMore && filterProducts.length > 0 && (
            <p className="text-sm text-gray-400">You have reached the end.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;