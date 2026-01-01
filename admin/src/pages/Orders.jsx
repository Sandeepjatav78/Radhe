import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // Sequence of Status (For Locking Logic)
  const statusFlow = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ];

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        backendURL + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch orders.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    let cancelReason = "";

    if (newStatus === "Cancelled") {
        cancelReason = prompt("Please enter the reason for cancellation:");
        if (!cancelReason) {
            toast.error("Cancellation requires a reason.");
            return; 
        }
    }

    try {
      const { data } = await axios.post(
        backendURL + "/api/order/status",
        { orderId, status: newStatus, reason: cancelReason }, 
        { headers: { token } }
      );
      if (data.success) {
        await fetchOrders();
        toast.success("Status Updated");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h3>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>No orders placed yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            
            // Logic for disabling options
            const currentStatusIndex = statusFlow.indexOf(order.status);
            const isFinalState = order.status === "Delivered" || order.status === "Cancelled";

            return (
                <div
                key={order._id}
                className={`grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border p-5 md:p-8 rounded-lg shadow-sm ${order.status === 'Cancelled' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
                >
                <img className="w-12" src={assets.parcel_icon} alt="Order" />

                {/* --- 1. PRODUCT DETAILS COLUMN --- */}
                <div>
                    <div className="flex flex-col gap-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            
                            {/* Product Image */}
                            <img 
                                src={Array.isArray(item.image) ? item.image[0] : item.image} 
                                alt={item.name} 
                                className="w-12 h-12 object-cover rounded bg-gray-100 border border-gray-200"
                            />

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Qty: <span className="font-bold text-gray-700">{item.quantity}</span> 
                                    <span className="mx-1">|</span> 
                                    Size: <span className="font-bold text-gray-700">{item.size || item.packSize}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                    </div>

                    <div className="mt-4 mb-2 font-medium text-gray-700 border-t pt-2">
                        {order.address ? (order.address.firstName + " " + order.address.lastName) : "User"}
                    </div>

                    {/* --- ✅ ORDER ID DISPLAY --- */}
                    <div className="mb-3">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-mono border border-gray-200">
                            ID: {order._id}
                        </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        {order.address && (
                            <>
                                <p>{order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                                <p className="mt-1">Tel: {order.address.phone}</p>
                                
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {/* Google Maps Link */}
                                    {order.address.lat && order.address.lng && (
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${order.address.lat},${order.address.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-white bg-blue-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-blue-700 shadow-sm"
                                        >
                                            📍 Map
                                        </a>
                                    )}

                                    {/* View Rx Button */}
                                    {order.prescriptionUrl && (
                                        <a 
                                            href={order.prescriptionUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-white bg-indigo-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-indigo-700 shadow-sm"
                                        >
                                            📄 Rx
                                        </a>
                                    )}
                                </div>

                                {/* Delivery Time Slot */}
                                {order.slot && (
                                    <div className="mt-2 bg-emerald-50 border border-emerald-200 p-2 rounded-md w-full sm:w-auto block">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Time Slot</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-sm">⏰</span>
                                            <p className="text-emerald-800 font-bold text-xs">{order.slot}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* --- 2. ORDER INFO COLUMN --- */}
                <div>
                    <p className="text-sm text-gray-700">Total Items: {order.items.length}</p>
                    <p className="mt-2 text-sm text-gray-700">Method: {order.paymentMethod}</p>
                    <p className={`mt-2 text-sm font-semibold ${order.payment ? "text-green-600" : "text-orange-600"}`}>
                        Payment: {order.payment ? "Done" : "Pending"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                    
                    {/* Cancellation Reason Display */}
                    {order.status === "Cancelled" && (
                        <div className="mt-3 bg-red-100 border border-red-300 p-2 rounded max-w-[200px]">
                            <p className="text-red-800 text-xs font-bold">🚫 Reason: {order.cancelReason}</p>
                        </div>
                    )}
                </div>

                <p className="text-sm sm:text-base font-bold text-emerald-700">
                    {currency}{order.amount}
                </p>

                {/* --- 3. STATUS DROPDOWN (LOCKED) --- */}
                <select
                    onChange={(event) => handleStatusChange(order._id, event.target.value)}
                    value={order.status}
                    disabled={isFinalState}
                    className={`p-2 font-semibold border rounded text-sm outline-none cursor-pointer
                        ${order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-300 cursor-not-allowed' : ''}
                        ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-not-allowed' : 'bg-gray-50 border-gray-300 text-gray-800'}
                    `}
                >
                    {statusFlow.map((status, index) => (
                        <option 
                            key={status} 
                            value={status}
                            disabled={index < currentStatusIndex} 
                        >
                            {status} {index < currentStatusIndex ? " (Done)" : ""}
                        </option>
                    ))}

                    <option value="Cancelled" disabled={order.status === "Delivered"}>
                        ❌ Cancel Order
                    </option>

                </select>
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;