import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const CouponCode = ({ totalAmount, onApplyCoupon }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warn("Enter a coupon code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/validate`,
        { code: couponCode, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon.code);
        setDiscount(response.data.coupon.discount);
        onApplyCoupon(response.data.coupon.code, response.data.coupon.discount);
        toast.success(`Discount of Rs ${response.data.coupon.discount} applied!`);
        setCouponCode("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCoupons = async () => {
    if (availableCoupons.length > 0) {
      setShowCoupons(!showCoupons);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/coupon/active`);
      setAvailableCoupons(response.data.coupons || []);
      setShowCoupons(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectCoupon = (code) => {
    setCouponCode(code);
  };

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 mb-4">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none uppercase"
        />
        <button
          onClick={handleApplyCoupon}
          disabled={loading}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-bold"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>

      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="p-3 bg-green-100 border-2 border-green-300 rounded-lg mb-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-green-700">✓ {appliedCoupon}</span>
            <span className="text-green-600 ml-3">Save Rs {discount}</span>
          </div>
          <button
            onClick={() => {
              setAppliedCoupon(null);
              setDiscount(0);
              onApplyCoupon(null, 0);
            }}
            className="text-green-700 hover:text-green-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Available Coupons */}
      <button
        onClick={handleLoadCoupons}
        className="text-purple-600 text-sm font-bold hover:text-purple-700 flex items-center gap-2"
      >
        🎉 View Available Coupons {showCoupons ? "▼" : "▶"}
      </button>

      {showCoupons && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableCoupons.length > 0 ? (
            availableCoupons.map((coupon) => (
              <button
                key={coupon._id}
                onClick={() => handleSelectCoupon(coupon.code)}
                className="p-2 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition text-left"
              >
                <div className="font-bold text-purple-700">{coupon.code}</div>
                <div className="text-xs text-gray-600">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% off`
                    : `Rs ${coupon.discountValue} off`}
                </div>
                {coupon.description && (
                  <div className="text-xs text-gray-500 mt-1">{coupon.description}</div>
                )}
              </button>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-3">
              No coupons available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponCode;
