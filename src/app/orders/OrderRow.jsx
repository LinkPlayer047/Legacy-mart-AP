import StatusBadge from "./StatusBadge";

export default function OrderRow({ order, refresh, onView }) {
  const updateStatus = async (status) => {
    const token = localStorage.getItem("adminToken");

    await fetch(`https://legacy-mart.vercel.app/api/orders/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    refresh();
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium">{order.orderNumber}</td>

      <td className="p-3">
        <p>{order.customer?.name || "N/A"}</p>
        <p className="text-xs text-gray-500">{order.customer?.email}</p>
      </td>

      <td className="p-3 font-semibold">Rs {order.totalPrice}</td>

      <td className="p-3">
        {order.paymentMethod || "COD"}{" "}
        {order.paymentMethod === "online" && (
          <span className={`ml-2 font-semibold ${
            order.status === "paid" ? "text-green-600" : "text-red-600"
          }`}>
            {order.status === "paid" ? "Paid" : "Pending"}
          </span>
        )}
      </td>

      <td className="p-3">
        <StatusBadge status={order.status} />
      </td>

      <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>

      <td className="p-3 text-center">
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>

      <td className="p-3 text-center">
        <button
          className="text-blue-500 hover:underline"
          onClick={onView}
        >
          View Details
        </button>
      </td>
    </tr>
  );
}
