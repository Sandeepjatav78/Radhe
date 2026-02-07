import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// --- Icons ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const List = ({ token }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // ✅ 1. NEW STATE: Store the total count from the backend
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState(""); 
  const limit = 10;

  const fetchProducts = async (pageNumber = 1, append = false, query = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/product/list`, {
        params: { 
            page: pageNumber, 
            limit, 
            search: query, 
            sort: "newest"
        },
      });

      if (res.data.success) {
        let newProducts = res.data.products || [];
        
        setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));
        
        // ✅ 2. UPDATE TOTAL: Get the real total from the backend response
        if (res.data.total !== undefined) {
            setTotal(res.data.total);
        }

        if (newProducts.length < limit) setHasMore(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch medicines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, false, searchTerm);
  }, []);

  useEffect(() => {
    if (page > 1) {
        fetchProducts(page, true, searchTerm);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false, value);
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      const res = await axios.post(`${backendURL}/api/product/remove`, { id }, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);
        setPage(1);
        setHasMore(true);
        fetchProducts(1, false, searchTerm);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 w-full relative">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your pharmacy stock and listings</p>
        </div>

        {/* --- Right Side: Search & Stats --- */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm"
                />
            </div>

            {/* ✅ 3. DISPLAY TOTAL: Show 'total' state instead of 'products.length' */}
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600 flex items-center justify-center whitespace-nowrap">
            Total Items: <span className="text-emerald-600 font-bold ml-1">{total}</span>
            </div>
        </div>
      </div>

      {/* --- Product List Grid --- */}
      <div className="flex flex-col gap-4">
        {products.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
             <div className="text-gray-300 mb-3"><SearchIcon /></div>
             <p className="text-gray-500 font-medium">No medicines found.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100 group-hover:bg-emerald-50/50 transition-colors">
                 <img src={product.image[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-0.5">{product.manufacturer}</p>
                    </div>
                    <span className="sm:hidden font-bold text-emerald-700">{currency}{product.price}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">{product.category}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium border border-gray-200">{product.packSize}</span>
                    {product.prescriptionRequired && <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-md font-bold border border-red-100 flex items-center gap-1">Rx Required</span>}
                    {product.bestsellar && <span className="bg-yellow-50 text-yellow-600 text-xs px-2.5 py-1 rounded-md font-bold border border-yellow-200">Bestseller</span>}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 border-t sm:border-none pt-3 sm:pt-0">
                <p className="hidden sm:block text-xl font-bold text-gray-800">{currency}{product.price}</p>
                <div className="flex gap-2">
                    <button onClick={() => navigate(`/update/${product._id}`)} className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"><EditIcon /> Edit</button>
                    <button onClick={() => removeProduct(product._id)} className="flex items-center gap-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"><TrashIcon /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Load More --- */}
      {hasMore && !loading && products.length > 0 && (
        <div className="flex justify-center mt-10 mb-10">
          <button onClick={handleLoadMore} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full hover:bg-gray-50 shadow-sm">Load More Items</button>
        </div>
      )}
      
      {loading && <div className="flex justify-center mt-8 mb-8"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}
    </div>
  );
};

export default List;