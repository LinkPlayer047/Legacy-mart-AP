const colors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        colors[status]
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
