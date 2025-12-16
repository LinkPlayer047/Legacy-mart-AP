"use client";

import React, { useEffect, useState } from "react";
import AddProductModal from "@/app/products/add/AddProductModal"; // import modal

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch categories from backend
  async function fetchCategories() {
    try {
      const res = await fetch("https://legacy-mart.vercel.app/api/category");
      const data = await res.json();
      const categoriesArray = data.categories || data;
      setCategories(categoriesArray);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  }

  // Fetch products from backend
  async function fetchProducts() {
    try {
      const res = await fetch("https://legacy-mart.vercel.app/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="flex min-h-screen">

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Category Products</h1>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Product
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            className={`px-4 py-2 border rounded ${
              selectedCategory === "All" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All Products
          </button>

          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat.id || cat._id || cat.name}
                className={`px-4 py-2 border rounded ${
                  selectedCategory === cat.name
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id || product.name}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                <img
                  src={
                    product.images?.[0]?.url ||
                    product.image ||
                    "/placeholder.png"
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-500">
                  Category: {product.category || "N/A"}
                </p>
                <p className="font-bold mt-1">PKR {product.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdded={async () => {
            setLoadingProducts(true);
            setLoadingCategories(true);
            await fetchCategories();
            await fetchProducts();
          }}
          allCategories={categories} // pass existing categories
        />
      </main>
    </div>
  );
}
