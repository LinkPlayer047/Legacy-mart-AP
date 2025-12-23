export default function OrderDetailsModal({ order, onClose }) {
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

    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative flex flex-col md:flex-row gap-6">
        
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Order #{order.orderNumber}</h2>

          <div className="mb-3">
            <strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})
          </div>
          <div className="mb-3">
            <strong>Address:</strong> {order.shipping?.address}, {order.shipping?.city || "N/A"}
          </div>
          <div className="mb-3">
            <strong>Total:</strong> Rs {order.totalPrice}
          </div>

          <div className="mb-3">
            <strong>Payment Method:</strong> {order.paymentMethod || "COD"}
          </div>
          {order.paymentMethod === "online" && (
            <div className="mb-3">
              <strong>Payment Status:</strong>{" "}
              {order.orderStatus === "paid" ? "Paid" : "Pending"}
            </div>
          )}
          {order.paymentId && (
            <div className="mb-3">
              <strong>Transaction ID:</strong> {order.paymentId}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded-md text-white capitalize ${
                  status === "pending" ? "bg-yellow-500" :
                  status === "confirmed" ? "bg-blue-500" :
                  status === "shipped" ? "bg-purple-500" :
                  status === "delivered" ? "bg-green-500" :
                  "bg-red-500"
                }`}
                onClick={() => updateStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[400px]">
          <h3 className="font-semibold mb-2 text-lg">Products</h3>
          <ul className="list-none">
            {order.items?.map((item) => (
              <li key={item.product._id} className="flex items-center gap-4 py-2">
                <img
                  src={item.product?.images?.[0]?.url || "https://via.placeholder.com/150"}
                  alt={item.product?.name || "Product Image"}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Subtotal: Rs {item.quantity * (item.product?.price || 0)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
