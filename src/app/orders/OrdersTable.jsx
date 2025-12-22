import OrderRow from "./OrderRow";

export default function OrdersTable({ orders, refresh }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Order #</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-center">Action</th>
            <th className="p-3 text-center">Details</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}

          {orders.map(order => (
            <OrderRow
              key={order._id}
              order={order}
              refresh={refresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
