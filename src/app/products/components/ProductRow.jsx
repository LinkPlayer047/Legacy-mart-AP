"use client";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition">
      <td className="px-4 py-2">{product.name}</td>
      <td className="px-4 py-2">PKR {product.price}</td>
      <td className="px-4 py-2">{product.category}</td>
      <td className="px-4 py-2 flex items-center gap-4">
        <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(product)} className="text-red-600 hover:text-red-800">
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
