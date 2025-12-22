"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/home/components/Sidebar";
import Loader from "@/components/Loader";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = document.cookie
        .split("; ")
        .find(r => r.startsWith("adminToken="))
        ?.split("=")[1];

      const res = await fetch(
        `https://legacy-mart.vercel.app/api/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setOrder(data.order);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p>Order not found</p>;

  return (
    <Sidebar>
      <h1 className="text-2xl font-bold mb-4">
        Order {order.orderNumber}
      </h1>

      {/* Customer */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>{order.customer.name}</p>
        <p className="text-gray-500">{order.customer.email}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p>{order.shipping.name}</p>
        <p>{order.shipping.phone}</p>
        <p>{order.shipping.address}</p>
        <p>{order.shipping.city}</p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="list-disc ml-5">
          {order.items.map(item => (
            <li key={item._id}>
              {item.product.name} × {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      <div className="font-semibold">
        Total: Rs {order.totalPrice}
      </div>
    </Sidebar>
  );
}
