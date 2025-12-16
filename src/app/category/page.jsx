"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/home/components/Sidebar";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://legacy-mart.vercel.app/api/category");
        const data = await res.json();
        // Check if API returns { categories: [...] } or just array
        const categoriesArray = data.categories || data;
        setCategories(categoriesArray);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false); // stop loading in both success and error
      }
    }
    fetchCategories();
  }, []);

  // Fetch products from backend
  useEffect(() => {
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Category Products</h1>

        {/* Category Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            className={`px-4 py-2 border rounded ${
              selectedCategory === "All" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat.id || cat._id || cat.name} // fallback key
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
                  src={product.images?.[0]?.url || product.image || "/placeholder.png"}
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
      </main>
    </div>
  );
}
