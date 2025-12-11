"use client";

import Sidebar from "@/components/home/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddProductModal from "./add/AddProductModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // 🆕

  async function loadProducts() {
    try {
      const res = await fetch("https://legacy-mart.vercel.app/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(product) {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

  try {
    const res = await fetch(`https://legacy-mart.vercel.app/api/products/${product._id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete product");

    loadProducts(); // reload products after delete
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

function editProduct(product) {
  setEditingProduct(product); // modal ko pata chale kaun edit kar raha
  setIsModalOpen(true);       // modal open karo
}

  function handleAdded() {
    // Reload products after adding
    loadProducts();
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-gray-600">Manage all your products</p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg shadow-md p-4 flex flex-col"
            >
              <img src={product.imageUrl || "/upload/placeholder.png"} alt={product.name} 
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="font-bold text-lg">{product.name}</h2>
              <p className="text-gray-600">PKR {product.price}</p>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => editProduct(product)}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                >
                Edit
                </button>
                <button
                  onClick={() => deleteProduct(product)}
                  className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdded={handleAdded}
        />
      </Sidebar>
    </ProtectedRoute>
  );
}
