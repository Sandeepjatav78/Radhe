import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const UserWishlist = () => {
  const { token, backendUrl, products } = useContext(ShopContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        console.log("Fetching wishlist...");
        const response = await axios.get(`${backendUrl}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.success || response.data.wishlist) {
          const items = response.data.wishlist?.items || [];
          console.log("Wishlist items fetched:", items.length);
          setWishlistItems(items);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token, backendUrl]);

  const handleRemove = async (productId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setWishlistItems(
          wishlistItems.filter((item) => item.productId !== productId)
        );
        toast.success("Removed from wishlist");
      } else {
        toast.error(response.data.message || "Error removing from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Error removing from wishlist");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading wishlist...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">💔</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wishlist Empty</h2>
        <p className="text-gray-600">
          Add your favorite medicines to save them for later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {wishlistItems.map((item) => {
        const product = products.find((p) => p._id === item.productId);
        if (!product) return null;

        return (
          <div
            key={item.productId}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-32 object-contain bg-gray-50"
              />
              <button
                onClick={() => handleRemove(item.productId)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
            <div className="p-2">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 mb-1">
                {product.name}
              </h3>
              <div className="text-xs text-gray-600 mb-2">
                Rs {product.variants?.[0]?.price}
              </div>
              <button className="w-full bg-emerald-600 text-white py-1 rounded text-xs font-bold hover:bg-emerald-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserWishlist;
