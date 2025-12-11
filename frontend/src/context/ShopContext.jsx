import React from "react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Cart Items State
  const [cartItems, setCartItems] = useState({});
  
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // --- 1. Add To Cart (Simple Logic) ---
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    
    // State update immediately for UI speed
    setCartItems(cartData);

    // Backend update
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
        toast.success("Added to Cart");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      toast.success("Added to Cart (Local)");
    }
  };

  // --- 2. Get Cart Count ---
  const getCartCount = () => {
    let totalCount = 0;
    // Iterate over simple object { itemId: quantity }
    for (const items in cartItems) {
      try {
        if (cartItems[items] > 0) {
          totalCount += cartItems[items];
        }
      } catch (error) {
        console.log(error);
      }
    }
    return totalCount;
  };

  // --- 3. Update Quantity ---
  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // --- 4. Get Cart Amount ---
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        try {
          if (cartItems[items] > 0) {
            totalAmount += itemInfo.price * cartItems[items];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // --- 5. Fetch Products List ---
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // --- 6. Fetch User Cart from DB (CRITICAL FIX) ---
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      
      if (response.data.success) {
        // Console log taaki pata chale data aaya ya nahi
        console.log("🛒 DB Cart Loaded:", response.data.cartData);
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("Cart Fetch Error:", error);
      toast.error(error.message);
    }
  };

  // Initial Load
  useEffect(() => {
    getProductsData();
  }, []);

  // Token & Cart Sync Logic
  useEffect(() => {
    // 1. Check LocalStorage on Load
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
    // 2. Fetch Cart whenever token changes (Login/Logout)
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;