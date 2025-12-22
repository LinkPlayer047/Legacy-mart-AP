export default function OrderDetailsModal({ order, onClose, updateStatus }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative flex flex-col md:flex-row gap-6">
        
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Left section: Order & Customer info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Order #{order.orderNumber}</h2>

          <div className="mb-3">
            <strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})
          </div>
          <div className="mb-3">
            <strong>Address:</strong> {order.address || "N/A"}
          </div>
          <div className="mb-3">
            <strong>Total:</strong> Rs {order.totalPrice}
          </div>
          <div className="mb-3">
            <strong>Status:</strong> 
            <span className="ml-2 font-semibold">{order.status}</span>
          </div>

          {/* Status update buttons */}
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

        {/* Right section: Products */}
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          <h3 className="font-semibold mb-2 text-lg">Products</h3>
          <ul className="divide-y divide-gray-200">
            {order.products?.map((p) => (
              <li key={p.product._id} className="flex items-center py-2 gap-4">
                <img
                  src={p.product.image || "/placeholder.png"}
                  alt={p.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{p.product.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {p.quantity}</p>
                  <p className="text-sm text-gray-500">Subtotal: Rs {p.quantity * p.product.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
