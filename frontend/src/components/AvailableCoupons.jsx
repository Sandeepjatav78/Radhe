import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AvailableCoupons = ({ onApplyCoupon, cartTotal }) => {
  const [showCoupons, setShowCoupons] = useState(false);

  const coupons = [
    // Free Delivery
    { 
      code: "FREEDEL", 
      desc: "Free Delivery", 
      minOrder: 0,
      type: "delivery",
      icon: "🚚"
    },
    { 
      code: "FREESHIP", 
      desc: "Free Delivery", 
      minOrder: 200,
      type: "delivery",
      icon: "🚚"
    },
    
    // Flat Discounts
    { 
      code: "WELCOME50", 
      desc: "₹50 OFF", 
      minOrder: 250,
      type: "flat",
      icon: "💰",
      limit: "Limited: 500 uses"
    },
    { 
      code: "FIRST50", 
      desc: "₹50 OFF", 
      minOrder: 300,
      type: "flat",
      icon: "💰",
      limit: "First time users"
    },
    { 
      code: "SAVE100", 
      desc: "₹100 OFF", 
      minOrder: 500,
      type: "flat",
      icon: "💰"
    },
    { 
      code: "SAVE200", 
      desc: "₹200 OFF", 
      minOrder: 1000,
      type: "flat",
      icon: "💵"
    },
    { 
      code: "SAVE300", 
      desc: "₹300 OFF", 
      minOrder: 1500,
      type: "flat",
      icon: "💵"
    },
    
    // Percentage Discounts
    { 
      code: "RADHE10", 
      desc: "10% OFF", 
      minOrder: 200,
      type: "percent",
      icon: "📊",
      max: "Max ₹100"
    },
    { 
      code: "RADHE15", 
      desc: "15% OFF", 
      minOrder: 500,
      type: "percent",
      icon: "📊",
      max: "Max ₹200"
    },
    { 
      code: "RADHE20", 
      desc: "20% OFF", 
      minOrder: 1000,
      type: "percent",
      icon: "📊",
      max: "Max ₹300"
    },
    { 
      code: "NEWUSER", 
      desc: "25% OFF", 
      minOrder: 300,
      type: "percent",
      icon: "🎁",
      max: "Max ₹150",
      limit: "New users only"
    },
    { 
      code: "HEALTH25", 
      desc: "25% OFF", 
      minOrder: 600,
      type: "percent",
      icon: "💊",
      max: "Max ₹250"
    }
  ];

  const handleCouponClick = (code, minOrder) => {
    if (cartTotal < minOrder) {
      toast.error(`Add items worth ₹${minOrder - cartTotal} more to use this coupon`);
      return;
    }
    onApplyCoupon(code);
    setShowCoupons(false);
  };

  const isEligible = (minOrder) => cartTotal >= minOrder;

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setShowCoupons(!showCoupons)}
        className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1"
      >
        <span>🎫</span>
        <span>{showCoupons ? 'Hide' : 'View'} Available Coupons</span>
      </button>

      {showCoupons && (
        <div className="mt-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Available Offers</h3>
          
          <div className="space-y-2">
            {coupons.map((coupon, index) => {
              const eligible = isEligible(coupon.minOrder);
              
              return (
                <div
                  key={index}
                  className={`border rounded-lg p-3 ${
                    eligible 
                      ? 'bg-white border-emerald-200 hover:border-emerald-400 cursor-pointer' 
                      : 'bg-gray-100 border-gray-200 opacity-60'
                  } transition-all`}
                  onClick={() => eligible && handleCouponClick(coupon.code, coupon.minOrder)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{coupon.icon}</span>
                        <span className="font-bold text-sm text-gray-800">{coupon.code}</span>
                        {coupon.limit && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            {coupon.limit}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {coupon.desc} • Min order: ₹{coupon.minOrder}
                        {coupon.max && ` • ${coupon.max}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!eligible}
                      className={`text-xs px-3 py-1 rounded font-medium ${
                        eligible
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCouponClick(coupon.code, coupon.minOrder);
                      }}
                    >
                      {eligible ? 'Apply' : `₹${coupon.minOrder - cartTotal} more`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableCoupons;
