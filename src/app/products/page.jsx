"use client";

import Sidebar from "@/components/home/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddProductModal from "./add/AddProductModal";
import { toast } from "react-hot-toast"; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // 🆕 For edit

  // Load products from API
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

  // Delete product
  async function deleteProduct(product) {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <span>Are you sure you want to delete "{product.name}"?</span>
      <div className="flex justify-end gap-2 mt-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={async () => {
            try {
              const res = await fetch(`https://legacy-mart.vercel.app/api/products/${product._id}`, {
                method: "DELETE",
              });
              if (!res.ok) throw new Error("Failed to delete product");

              toast.success(`"${product.name}" deleted successfully`);
              loadProducts(); // reload products
              toast.dismiss(t.id); // close the confirmation toast
            } catch (err) {
              toast.error(err.message || "Something went wrong!");
              console.error(err);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity, // keeps it open until action
  });
}


  // Open modal for edit
  function editProduct(product) {
    setEditingProduct(product); // Pass product to modal
    setIsModalOpen(true);
  }

  // Open modal for add
  function addProduct() {
    setEditingProduct(null); // No initial data
    setIsModalOpen(true);
  }

  // After adding/updating
  function handleAdded() {
    loadProducts();
    setIsModalOpen(false);
    setEditingProduct(null); // Reset editing
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-gray-600">Manage all your products</p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={addProduct}
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
              <img
                src={product.images?.[0]?.url || ""}
                alt={product.name}
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

        {/* Add/Edit Product Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null); // Reset after closing
          }}
          onAdded={handleAdded}
          initialData={editingProduct} // 🆕 Pass product data for edit
        />
      </Sidebar>
    </ProtectedRoute>
  );
}
