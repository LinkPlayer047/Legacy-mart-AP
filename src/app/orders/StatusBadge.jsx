export default function StatusBadge({ status }) {
  const safeStatus = status || "pending";

  const colors = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
        colors[safeStatus] || "bg-gray-500"
      }`}
    >
      {safeStatus.toUpperCase()}
    </span>
  );
}
