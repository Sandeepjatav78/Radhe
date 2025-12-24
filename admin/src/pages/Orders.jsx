import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

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
    try {
      const { data } = await axios.post(
        backendURL + "/api/order/status",
        { orderId, status: newStatus },
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
          {orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 p-5 md:p-8 bg-white rounded-lg shadow-sm"
            >
              <img className="w-12" src={assets.parcel_icon} alt="Order" />

              <div>
                <div className="text-sm font-medium text-gray-800">
                  {order.items.map((item, index) => (
                      <p key={index} className="py-0.5">
                        {item.name} x {item.quantity} 
                        {/* ⚠️ CHANGED: Show Variant Size (e.g. 50ml) instead of generic PackSize */}
                        <span className="text-gray-500 text-xs ml-1">
                            [{item.size || item.packSize}]
                        </span>
                      </p>
                  ))}
                </div>

                <div className="mt-3 mb-2 font-medium text-gray-700">
                    {order.address ? (order.address.firstName + " " + order.address.lastName) : "User"}
                </div>
                
                <div className="text-sm text-gray-600">
                  {order.address && (
                      <>
                        <p>{order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                        <p className="mt-1">Tel: {order.address.phone}</p>
                        
                        {/* --- FIXED: GOOGLE MAPS LINK --- */}
                        {order.address.lat && order.address.lng ? (
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${order.address.lat},${order.address.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-white bg-emerald-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-700 shadow-sm"
                            >
                                📍 View Delivery Location
                            </a>
                        ) : (
                            <span className="text-xs text-orange-500 mt-2 block">No GPS Location</span>
                        )}
                      </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-700">Items: {order.items.length}</p>
                <p className="mt-2 text-sm text-gray-700">Method: {order.paymentMethod}</p>
                <p className={`mt-2 text-sm font-semibold ${order.payment ? "text-green-600" : "text-orange-600"}`}>
                    Payment: {order.payment ? "Done" : "Pending"}
                </p>
                <p className="mt-2 text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <p className="text-sm sm:text-base font-bold text-emerald-700">
                {currency}{order.amount}
              </p>

              <select
                onChange={(event) => handleStatusChange(order._id, event.target.value)}
                value={order.status}
                className="p-2 font-semibold border border-gray-300 rounded focus:outline-emerald-500 bg-gray-50 text-sm"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;