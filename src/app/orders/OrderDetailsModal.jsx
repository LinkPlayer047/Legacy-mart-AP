export default function OrderDetailsModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Order #{order.orderNumber}</h2>

        <div className="mb-2">
          <strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})
        </div>
        <div className="mb-2">
          <strong>Address:</strong> {order.address || "N/A"}
        </div>
        <div className="mb-2">
          <strong>Total:</strong> Rs {order.totalPrice}
        </div>
        <div className="mb-2">
          <strong>Status:</strong> {order.status}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Products:</h3>
          <ul className="list-disc list-inside">
            {order.products?.map(p => (
              <li key={p.product._id}>
                {p.product.name} x {p.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
