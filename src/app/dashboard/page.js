"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/home/components/Sidebar";
import { ImUsers } from "react-icons/im";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { FaCartShopping, FaEye } from "react-icons/fa6";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("adminToken="))
          ?.split("=")[1];

        if (!token) return;

        // Fetch Users
        const usersRes = await fetch("https://legacy-mart.vercel.app/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();

        // Fetch Products
        const productsRes = await fetch("https://legacy-mart.vercel.app/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsData = await productsRes.json();

        // Fetch Orders
        const ordersRes = await fetch("https://legacy-mart.vercel.app/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();

        // Set stats
        setStats({
          users: usersData.users?.length || 0,
          products: productsData.products?.length || 0,
          orders: ordersData.orders?.length || 0,
        });

        // Last 5 orders
        setRecentOrders(ordersData.orders?.slice(-5).reverse() || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const statItems = [
    {
      title: "Total Users",
      value: stats.users,
      subtitle: "Unique Customers",
      icon: <ImUsers className="text-blue-500 text-4xl" />,
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Total Products",
      value: stats.products,
      subtitle: "In Inventory",
      icon: <BsFillBoxSeamFill className="text-purple-500 text-4xl" />,
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      subtitle: "All Time Orders",
      icon: <FaCartShopping className="text-orange-500 text-4xl" />,
      bgColor: "bg-orange-500/20",
    },
  ];

  return (
    <ProtectedRoute>
      <Sidebar>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the admin dashboard!</p>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:w-4/5">
          {statItems.map((item, index) => (
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

        {/* Recent Orders */}
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
                {recentOrders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-b-gray-500/50 hover:bg-white transition-colors"
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className={`px-4 py-2 font-medium ${order.status === "Completed" ? "text-green-600" : "text-yellow-500"}`}>
                      {order.status}
                    </td>
                    <td className="px-4 py-2">PKR {order.total}</td>
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
