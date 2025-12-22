"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/home/components/Sidebar";
import { ImUsers } from "react-icons/im";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { FaCartShopping, FaEye } from "react-icons/fa6";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // Agar orders API bhi hai
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("adminToken="))
      ?.split("=")[1];

    try {
      // Fetch users
      const usersRes = await fetch("https://legacy-mart.vercel.app/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      // Fetch products
      const productsRes = await fetch("https://legacy-mart.vercel.app/api/products", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const productsData = await productsRes.json();
      setProducts(productsData || []);

      // Fetch orders if exists
      const ordersRes = await fetch("https://legacy-mart.vercel.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      subtitle: "Unique Customers",
      icon: <ImUsers className="text-blue-500 text-4xl" />,
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Total Products",
      value: products.length,
      subtitle: "In Inventory",
      icon: <BsFillBoxSeamFill className="text-purple-500 text-4xl" />,
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Total Orders",
      value: orders.length,
      subtitle: "All Time Orders",
      icon: <FaCartShopping className="text-orange-500 text-4xl" />,
      bgColor: "bg-orange-500/20",
    },
  ];

  if (loading) return <Loader />

  return (
    <ProtectedRoute>
      <Sidebar>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the admin dashboard!</p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:w-4/5">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white border border-gray-300/50 shadow-md rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-light text-gray-500">{item.title}</p>
                <h2 className="text-2xl font-semibold my-1">{item.value}</h2>
                <p className="text-sm font-light text-gray-500">{item.subtitle}</p>
              </div>
              <div className="flex items-center justify-center w-16 h-16 rounded-full">
                <div className={`flex items-center justify-center rounded-full p-3 ${item.bgColor}`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="mt-6 p-4 bg-gray-200/40 border border-gray-300/50 shadow-md rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
              <FaEye className="text-lg" />
              <span>View All Orders</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-300/50">
                  <th className="px-4 py-2 text-black font-semibold">Order ID</th>
                  <th className="px-4 py-2 text-black font-semibold">Customer</th>
                  <th className="px-4 py-2 text-black font-semibold">Status</th>
                  <th className="px-4 py-2 text-black font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
  {orders.slice(0, 5).map((order, idx) => (
    <tr
      key={order._id}
      className="border-b border-b-gray-500/50 hover:bg-white transition-colors"
    >
      <td className="px-4 py-2">
        {order.orderNumber || order._id}
      </td>

      <td className="px-4 py-2">
        <div>
          <p className="font-medium">
            {order.customer?.name || "N/A"}
          </p>
          <p className="text-xs text-gray-500">
            {order.customer?.email || ""}
          </p>
        </div>
      </td>

      <td className="px-4 py-2 font-medium">
        {order.status}
      </td>

      <td className="px-4 py-2 font-semibold">
        Rs {order.totalPrice}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
