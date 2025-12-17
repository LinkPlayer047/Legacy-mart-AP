"use client";
import { useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import Sidebar from "@/components/home/components/Sidebar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("adminToken="))
        ?.split("=")[1];

      const res = await fetch("https://legacy-mart.vercel.app/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <Sidebar >
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <OrdersTable orders={orders} refresh={fetchOrders} />
    </div>
    </Sidebar>
  );
}
