// API Helper - Gets fresh Clerk token for each request
import axios from 'axios';

// This will be set by App.jsx
let getTokenFunction = null;

export const setGetTokenFunction = (fn) => {
  getTokenFunction = fn;
  console.log('[APIHelper] ✅ getToken function registered');
};

// Helper to get fresh token
export const getFreshToken = async () => {
  if (!getTokenFunction) {
    console.error('[APIHelper] ❌ getTokenFunction not set!');
    return null;
  }
  
  try {
    const token = await getTokenFunction();
    if (!token) {
      console.error('[APIHelper] ❌ Could not get token from Clerk');
      return null;
    }
    return token;
  } catch (error) {
    console.error('[APIHelper] ❌ Error getting fresh token:', error);
    return null;
  }
};

// Create axios instance with fresh token interceptor
export const createApiCall = async (axiosConfig) => {
  try {
    const freshToken = await getFreshToken();
    if (freshToken) {
      axiosConfig.headers = axiosConfig.headers || {};
      axiosConfig.headers.Authorization = `Bearer ${freshToken}`;
      console.log('[APIHelper] 🔐 Fresh token added to request');
    }
    return axiosConfig;
  } catch (error) {
    console.error('[APIHelper] Error adding token:', error);
    return axiosConfig;
  }
};
