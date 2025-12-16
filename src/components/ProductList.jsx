"use client";

import React from "react";

export default function Productlist2({ products, pageTitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{pageTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-500">Category: {product.category}</p>
            <p className="font-bold mt-1">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
