// API Helper - Gets the stored JWT token for each request
import axios from 'axios';

// Helper to get the stored token
export const getFreshToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('[APIHelper] ❌ No token found in localStorage');
    return null;
  }
  return token;
};

// Create axios instance with token interceptor
export const createApiCall = async (axiosConfig) => {
  try {
    const freshToken = await getFreshToken();
    if (freshToken) {
      axiosConfig.headers = axiosConfig.headers || {};
      axiosConfig.headers.Authorization = `Bearer ${freshToken}`;
      console.log('[APIHelper] 🔐 Token added to request');
    }
    return axiosConfig;
  } catch (error) {
    console.error('[APIHelper] Error adding token:', error);
    return axiosConfig;
  }
};