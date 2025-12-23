"use client";
import { useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import Sidebar from "@/components/home/components/Sidebar";
import Loader from "@/components/Loader";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const res = await fetch(
        "https://legacy-mart.vercel.app/api/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <Sidebar>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
        <OrdersTable orders={orders} refresh={fetchOrders} />
      </div>
    </Sidebar>
  );
}
