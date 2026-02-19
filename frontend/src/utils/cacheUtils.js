// Cache Utility Functions
// Centralized cache management for better performance

/**
 * Cache duration constants (in milliseconds)
 */
export const CACHE_DURATIONS = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
};

/**
 * Set data in cache with timestamp
 * @param {string} key - Cache key
 * @param {any} data - Data to cache (will be stringified)
 */
export const setCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_timestamp`, new Date().getTime().toString());
    console.log(`✅ Cache set: ${key}`);
  } catch (error) {
    console.error(`Failed to set cache for ${key}:`, error);
  }
};

/**
 * Get data from cache if still valid
 * @param {string} key - Cache key
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getCache = (key, maxAge = CACHE_DURATIONS.MEDIUM) => {
  try {
    const cachedData = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);
    
    if (!cachedData || !timestamp) {
      return null;
    }
    
    const now = new Date().getTime();
    const age = now - parseInt(timestamp);
    
    if (age < maxAge) {
      console.log(`✅ Cache hit: ${key} (age: ${Math.round(age / 1000)}s)`);
      return JSON.parse(cachedData);
    } else {
      console.log(`⏰ Cache expired: ${key}`);
      clearCache(key);
      return null;
    }
  } catch (error) {
    console.error(`Failed to get cache for ${key}:`, error);
    return null;
  }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key to clear
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
    console.log(`🗑️ Cache cleared: ${key}`);
  } catch (error) {
    console.error(`Failed to clear cache for ${key}:`, error);
  }
};

/**
 * Clear all cache entries (useful for logout or force refresh)
 */
export const clearAllCache = () => {
  try {
    const cacheKeys = [
      'productsCache',
      'categoriesCache',
      // Add more cache keys here as needed
    ];
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
    });
    
    console.log('🗑️ All cache cleared');
  } catch (error) {
    console.error('Failed to clear all cache:', error);
  }
};

/**
 * Check if cache exists and is valid
 * @param {string} key - Cache key
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {boolean}
 */
export const isCacheValid = (key, maxAge = CACHE_DURATIONS.MEDIUM) => {
  const timestamp = localStorage.getItem(`${key}_timestamp`);
  if (!timestamp) return false;
  
  const now = new Date().getTime();
  const age = now - parseInt(timestamp);
  return age < maxAge;
};

/**
 * Get cache age in seconds
 * @param {string} key - Cache key
 * @returns {number|null} - Age in seconds or null if not found
 */
export const getCacheAge = (key) => {
  const timestamp = localStorage.getItem(`${key}_timestamp`);
  if (!timestamp) return null;
  
  const now = new Date().getTime();
  const age = now - parseInt(timestamp);
  return Math.round(age / 1000);
};

export default {
  setCache,
  getCache,
  clearCache,
  clearAllCache,
  isCacheValid,
  getCacheAge,
  CACHE_DURATIONS
};
