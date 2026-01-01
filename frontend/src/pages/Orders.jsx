import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  // Pharmacy Status Colors (Medical Theme)
  const statusColors = {
    'order placed': 'bg-blue-500',
    'packing': 'bg-indigo-500',
    'shipped': 'bg-yellow-500',
    'out for delivery': 'bg-orange-500',
    'delivered': 'bg-emerald-600',
    'cancelled': 'bg-red-500',
  };

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await fetch(backendUrl + '/api/order/userorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success) {
        const allOrdersItem = [];
        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status?.toLowerCase() || 'unknown',
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              slot: order.slot,
              cancelReason: order.cancelReason,
              orderId: order._id, // ✅ SAVING ORDER ID HERE
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (!orderData.length)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 px-4">
        <p className="text-2xl font-semibold mb-2">No Past Orders</p>
        <p className="text-gray-400 text-center mb-6">
          You haven’t ordered any medicines yet.
        </p>
      </div>
    );

  return (
    <div className="border-t px-4 max-w-7xl mx-auto pt-10">
      <div className="text-2xl mb-6">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="flex flex-col gap-6">
        {orderData.map((item, index) => {
          
          // --- SAFETY CHECK FOR IMAGE ---
          const itemImage = Array.isArray(item.image) 
              ? item.image[0] 
              : item.image || "https://via.placeholder.com/150";

          return (
            <div
              key={index}
              className="py-4 border border-gray-100 rounded-xl shadow-sm bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 hover:shadow-md transition-shadow"
            >
              {/* Left side: Medicine Info */}
              <div className="flex items-start gap-4 md:gap-6 text-sm md:text-base">
                
                <img src={itemImage} className="w-16 sm:w-20 rounded-lg object-contain bg-gray-50 border" alt={item.name} />
                
                <div className="flex flex-col gap-1">
                  
                  {/* --- ✅ ORDER ID DISPLAY --- */}
                  <span className="text-[10px] text-gray-400 font-mono">
                      ID: {item.orderId}
                  </span>

                  <p className="font-bold text-gray-800 text-base">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
                    <p className='font-semibold text-emerald-700'>
                      {currency}{item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p className='bg-gray-100 px-2 rounded text-xs py-0.5'>
                      {item.size || item.packSize || "Unit"}
                    </p>
                  </div>
                  
                  <p className="text-gray-400 text-xs mt-1">
                    Ordered on: {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-xs font-medium">Payment: {item.paymentMethod}</p>
                </div>
              </div>

              {/* Right side: Status & Track */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-6 mt-2 md:mt-0">
                
                {/* --- 1. CANCELLATION REASON (Show if Cancelled) --- */}
                {item.status === 'cancelled' ? (
                     <div className="md:text-right bg-red-50 px-3 py-2 rounded-lg border border-red-100 inline-block self-start md:self-auto max-w-[220px]">
                        <div className="flex items-center gap-1 text-red-600 mb-1">
                            <span className="text-sm">🚫</span>
                            <p className="text-[10px] font-bold uppercase tracking-wide">Order Cancelled</p>
                        </div>
                        <p className="text-red-700 text-xs font-medium leading-tight">
                            Reason: {item.cancelReason || "Prescription Invalid / Other"}
                        </p>
                    </div>
                ) : (
                    /* --- 2. DELIVERY TIME SLOT (Show if Active) --- */
                    item.status !== 'delivered' && item.slot && (
                        <div className="md:text-right bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-block self-start md:self-auto">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Expected Arrival</p>
                            <p className="text-blue-700 font-bold text-xs flex items-center gap-1">
                                🕒 {item.slot}
                            </p>
                        </div>
                    )
                )}

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span
                    className={`w-3 h-3 rounded-full ${statusColors[item.status] || 'bg-gray-400'}`}
                  ></span>
                  <p className="text-sm md:text-base font-medium capitalize text-gray-700">{item.status}</p>
                </div>

                {/* Hide Track Button if Cancelled */}
                {item.status !== 'cancelled' && (
                    <button
                    onClick={loadOrderData}
                    className="border border-gray-300 px-4 py-2 text-sm font-medium rounded-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition mt-2 md:mt-0"
                    >
                    Track Order
                    </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;