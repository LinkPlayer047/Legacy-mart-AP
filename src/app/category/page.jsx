"use client";
import React, { useEffect, useState } from "react";
import Productlist from "@/components/ProductList";

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
        setCategories(data);
        setLoadingCategories(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
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
        setLoadingProducts(false);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Category Products</h1>

      {/* Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {/* All Button */}
        <button
          className={`px-4 py-2 border rounded ${
            selectedCategory === "All" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>

        {/* Dynamic Category Buttons */}
        {loadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 border rounded ${
                selectedCategory === cat.name ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))
        )}
      </div>

      {/* Products */}
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : filteredProducts.length > 0 ? (
        <Productlist
          products={filteredProducts}
          pageTitle={`${selectedCategory} Products`}
        />
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
}
