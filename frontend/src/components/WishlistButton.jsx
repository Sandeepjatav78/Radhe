import React, { useContext } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { useWishlist } from "../hooks/useWishlist";

const WishlistButton = ({ productId, className = "" }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const { isInWishlist, loading, isChecking, toggleWishlist } = useWishlist(
    productId,
    token,
    backendUrl
  );

  const handleClick = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!token || token.trim() === "") {
      toast.info("Please login to use wishlist");
      return;
    }

    if (loading || isChecking) {
      return;
    }

    const result = await toggleWishlist();
    
    if (result && result.success) {
      toast.success(result.message);
    } else if (result) {
      toast.error(result.message);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`p-2 rounded-full transition-all ${className} bg-gray-200 text-gray-400 cursor-not-allowed`}
        title="Loading..."
      >
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${className} ${
        isInWishlist
          ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      type="button"
    >
      <HeartIcon filled={isInWishlist} />
    </button>
  );
};

// Standalone Heart SVG Component
const HeartIcon = ({ filled }) => {
  if (filled) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
};

export default WishlistButton;
