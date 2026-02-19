import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdvancedFilters = ({ onFilterChange, priceRange = [0, 10000] }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    rating: 0,
    sortBy: "newest",
  });

  const categories = [
    "Antibiotics",
    "Pain Relief",
    "Cough & Cold",
    "Vitamins",
    "Digestive",
    "Skin Care",
    "Diabetes",
    "Blood Pressure",
  ];

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="sticky top-20 sm:top-16 z-40">
      {/* Filter Toggle (Mobile) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="md:hidden w-full bg-emerald-600 text-white py-3 rounded-lg flex items-center justify-between font-bold mb-4"
      >
        <span>🔍 Filters</span>
        <span>{expanded ? "▼" : "▶"}</span>
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {(expanded || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:block p-4 bg-white rounded-xl border-2 border-gray-200 space-y-5 mb-4"
          >
            {/* Sort */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Price Range</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) =>
                      handleFilterChange("priceMin", parseInt(e.target.value))
                    }
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) =>
                      handleFilterChange("priceMax", parseInt(e.target.value))
                    }
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  step="100"
                  value={filters.priceMax}
                  onChange={(e) =>
                    handleFilterChange("priceMax", parseInt(e.target.value))
                  }
                  className="w-full"
                />
                <div className="text-sm text-gray-600">
                  Rs {filters.priceMin} - Rs {filters.priceMax}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[0, 4, 3.5, 3, 2.5].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) =>
                        handleFilterChange("rating", parseFloat(e.target.value))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      {rating === 0
                        ? "All Ratings"
                        : `${rating}★ & above`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setFilters({
                  priceMin: priceRange[0],
                  priceMax: priceRange[1],
                  rating: 0,
                  sortBy: "newest",
                });
                onFilterChange({});
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-bold"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
