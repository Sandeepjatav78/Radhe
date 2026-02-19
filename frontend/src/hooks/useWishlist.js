import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

// Simple in-memory cache for wishlist status
const wishlistCache = new Map();
const cacheExpiry = 5 * 60 * 1000; // 5 minutes

export const useWishlist = (productId, token, backendUrl) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const abortControllerRef = useRef(null);

  // Clear cache on mount/unmount based on time
  useEffect(() => {
    const now = Date.now();
    for (const [key, value] of wishlistCache.entries()) {
      if (now - value.timestamp > cacheExpiry) {
        wishlistCache.delete(key);
      }
    }
  }, []);

  // Check if product is in wishlist
  useEffect(() => {
    // Don't fetch if missing required params or if token is being loaded
    if (!token || token.trim() === "" || !productId || !backendUrl) {
      setIsInWishlist(false);
      setIsChecking(false);
      return;
    }

    const checkWishlist = async () => {
      const cacheKey = `${productId}_${token}`;
      
      // Check if we have a cached value
      if (wishlistCache.has(cacheKey)) {
        const cached = wishlistCache.get(cacheKey);
        console.log(`✅ [Wishlist] Using cached value for product ${productId}`);
        setIsInWishlist(cached.value);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);

      // Create new abort controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        console.log(`🔍 [Wishlist] Checking product ${productId}...`);
        const response = await axios.get(
          `${backendUrl}/api/wishlist/check/${productId}`,
          {
            headers: { 
              token,
              'Content-Type': 'application/json'
            },
            signal: controller.signal,
            timeout: 8000
          }
        );

        // Only update state if request wasn't aborted
        if (!controller.signal.aborted) {
          const wishlistStatus = response.data?.inWishlist ?? false;
          console.log(`✅ [Wishlist] Product ${productId} - In Wishlist: ${wishlistStatus}`);
          
          // Cache the result
          wishlistCache.set(cacheKey, { value: wishlistStatus, timestamp: Date.now() });
          setIsInWishlist(wishlistStatus);
          setIsChecking(false);
        }
      } catch (error) {
        // Silently ignore abort errors (expected when component unmounts)
        if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
          return;
        }

        // Only update state if request wasn't aborted
        if (!controller.signal.aborted) {
          if (error.response?.status === 401) {
            console.warn("⚠️  [Wishlist] Session expired or invalid token");
            setIsInWishlist(false);
          } else if (error.response?.status === 500) {
            console.error(`❌ [Wishlist] Server error for ${productId}`);
            setIsInWishlist(false);
          } else if (error.response?.status) {
            console.warn(`⚠️  [Wishlist] Check error for ${productId}: ${error.response.status}`);
            setIsInWishlist(false);
          } else {
            console.warn(`⚠️  [Wishlist] Check error for ${productId}: ${error.message}`);
            setIsInWishlist(false);
          }
          setIsChecking(false);
        }
      }
    };

    checkWishlist();

    return () => {
      // Abort request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [token, productId, backendUrl]);

  const toggleWishlist = useCallback(async () => {
    if (!token || loading || isChecking) {
      return { success: false, message: 'Please wait...' };
    }

    const previousState = isInWishlist;
    const cacheKey = `${productId}_${token}`;
    setLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        console.log(`🗑️  [Wishlist] Removing product ${productId}...`);
        setIsInWishlist(false);

        const response = await axios.post(
          `${backendUrl}/api/wishlist/remove`,
          { productId },
          {
            headers: { 
              token,
              'Content-Type': 'application/json'
            },
            timeout: 8000
          }
        );

        if (response.data?.success) {
          console.log(`✅ [Wishlist] Removed product ${productId}`);
          // Update cache
          wishlistCache.set(cacheKey, { value: false, timestamp: Date.now() });
          return { success: true, message: 'Removed from wishlist' };
        } else {
          console.log(`⚠️  [Wishlist] Failed to remove:`, response.data?.message);
          setIsInWishlist(previousState);
          return { success: false, message: response.data?.message || 'Failed to remove' };
        }
      } else {
        // Add to wishlist
        console.log(`➕ [Wishlist] Adding product ${productId}...`);
        setIsInWishlist(true);

        const response = await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId },
          {
            headers: { 
              token,
              'Content-Type': 'application/json'
            },
            timeout: 8000
          }
        );

        if (response.data?.success) {
          console.log(`✅ [Wishlist] Added product ${productId}`);
          // Update cache
          wishlistCache.set(cacheKey, { value: true, timestamp: Date.now() });
          return { success: true, message: 'Added to wishlist' };
        } else {
          console.log(`⚠️  [Wishlist] Failed to add:`, response.data?.message);
          setIsInWishlist(previousState);
          return { success: false, message: response.data?.message || 'Failed to add' };
        }
      }
    } catch (error) {
      setIsInWishlist(previousState);

      if (error.response?.status === 401) {
        console.warn('⚠️  [Wishlist] Session expired, please login again');
        return { success: false, message: 'Session expired. Please login again.' };
      } else if (error.response?.status === 429) {
        console.warn('⚠️  [Wishlist] Rate limited - too many requests');
        return { success: false, message: 'Too many requests. Please wait.' };
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.warn('⚠️  [Wishlist] Request timeout');
        return { success: false, message: 'Request timed out. Please try again.' };
      } else {
        console.error('❌ [Wishlist] Error:', error.message || error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error updating wishlist' 
        };
      }
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl, productId, isInWishlist, loading, isChecking]);

  return {
    isInWishlist,
    loading,
    isChecking,
    toggleWishlist,
    clearCache: () => {
      const cacheKey = `${productId}_${token}`;
      wishlistCache.delete(cacheKey);
    }
  };
};
