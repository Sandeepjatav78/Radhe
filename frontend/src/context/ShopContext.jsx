import React, { createContext, useEffect, useState } from "react";
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
  
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // --- 1. Add To Cart (UPDATED FOR SIZE) ---
  const addToCart = async (itemId, size) => {
    
    if (!size) {
        toast.error("Please Select Size");
        return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size }, // Size bhejna zaroori hai
          { headers: { token } }
        );
        toast.success("Added to Cart");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      toast.success("Added to Cart");
    }
  };

  // --- 2. Get Cart Count (UPDATED LOOP) ---
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
           console.log(error);
        }
      }
    }
    return totalCount;
  };

  // --- 3. Update Quantity (UPDATED FOR SIZE) ---
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // --- 4. Get Cart Amount (UPDATED FOR VARIANT PRICE) ---
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
            try {
                if (cartItems[itemId][size] > 0) {
                    // Find correct price for this size
                    let variantPrice = itemInfo.price; // Default (Fallback)
                    
                    // Agar product me variants hain, to sahi variant ka price nikalo
                    if(itemInfo.variants && itemInfo.variants.length > 0) {
                        const variant = itemInfo.variants.find(v => v.size === size);
                        if(variant) variantPrice = variant.price;
                    }

                    totalAmount += variantPrice * cartItems[itemId][size];
                }
            } catch (error) {
                console.log(error);
            }
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

  // --- 6. Fetch User Cart ---
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("Cart Fetch Error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, setCartItems,
    getCartCount, updateQuantity,
    getCartAmount, navigate, backendUrl,
    setToken, token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;