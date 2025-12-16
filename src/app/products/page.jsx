"use client";

import Sidebar from "@/components/home/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddProductModal from "./add/AddProductModal";
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products from API
  async function loadProducts() {
    try {
      const res = await fetch("https://legacy-mart.vercel.app/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Open add product modal
  function addProduct() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  // Open edit product modal
  function editProduct(product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  // Open delete confirmation modal
  function handleDeleteClick(product) {
    setSelectedProduct(product);
    setIsConfirmOpen(true);
  }

  // Confirm delete action
  async function confirmDelete() {
    if (!selectedProduct) return;
    try {
      const res = await fetch(
        `https://legacy-mart.vercel.app/api/products/${selectedProduct._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete product");

      toast.success(`"${selectedProduct.name}" deleted successfully`);
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsConfirmOpen(false);
      setSelectedProduct(null);
    }
  }

  // After adding/updating product
  function handleAdded() {
    loadProducts();
    setIsModalOpen(false);
    setEditingProduct(null);
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
  {products.map((product) => {
    const hasSale = product.sale > 0;
    const salePrice = hasSale
      ? (product.price * (100 - product.sale)) / 100
      : product.price;

    return (
      <div
        key={product._id}
        className="relative bg-white border border-gray-400 rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-200"
      >
        {/* Sale Badge */}
        {hasSale && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            {product.sale}% OFF
          </span>
        )}

        <div>
          <img
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />

          <h2 className="font-bold text-lg">{product.name}</h2>

          {/* Price Display */}
          <div className="mt-1">
            {hasSale ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">
                  PKR {product.price.toLocaleString()}
                </span>
                <span className="text-green-600 font-bold">
                  PKR {salePrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-gray-800 font-semibold">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm mt-1">{product.category}</p>

          {/* Short Description: 1 line only */}
          {product.description && (
            <p className="text-gray-700 text-sm mt-2 line-clamp-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Buttons at bottom */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => editProduct(product)}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(product)}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    );
  })}
</div>


        {/* Add/Edit Product Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onAdded={handleAdded}
          initialData={editingProduct}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        />
      </Sidebar>
    </ProtectedRoute>
  );
}
