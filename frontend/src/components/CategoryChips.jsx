import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { getCache, setCache, CACHE_DURATIONS } from '../utils/cacheUtils';

// Swiggy-style horizontal scrollable category chips
const CategoryChips = ({ onSelect }) => {
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [chips, setChips] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchChips = async () => {
      try {
        const cached = getCache('chipsCache', CACHE_DURATIONS.MEDIUM);
        if (cached) { setChips(cached); return; }

        const response = await axios.get(backendUrl + '/api/product/categories');
        if (response.data.success) {
          const names = response.data.categories.map((c) => c.name);
          const withAll = ['All', ...names];
          setChips(withAll);
          setCache('chipsCache', withAll);
        }
      } catch (error) {
        setChips(['All']);
      }
    };
    fetchChips();
  }, [backendUrl]);

  const handleSelect = (chip) => {
    setSelected(chip);
    if (onSelect) { onSelect(chip); return; }
    if (chip === 'All') {
      navigate('/collection');
    } else {
      navigate(`/collection?category=${encodeURIComponent(chip)}`);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
      {chips.map((chip) => {
        const isActive = selected === chip;
        return (
          <button
            key={chip}
            onClick={() => handleSelect(chip)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all active:scale-95 ${
              isActive
                ? 'bg-brand text-white border-brand shadow-md shadow-brand/30'
                : 'bg-white text-gray-700 border-gray-200 hover:border-brand hover:text-brand'
            }`}
          >
            {chip === 'All' ? '🗂️ All' : chip}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;