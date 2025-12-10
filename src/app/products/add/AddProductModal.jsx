"use client";

import { useState, useRef, useEffect } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

export default function AddProductModal({ isOpen, onClose, onAdded, initialData }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    colors: [],
    sizes: [],
    sale: 0,
    images: [],
  });

  const imageInputRef = useRef();

  // Prefill form when editing
  useEffect(() => {
  if (initialData) {
    setForm({
      ...initialData,
      images: initialData.images || [], // 🆕 safe default
      colors: initialData.colors || [],
      sizes: initialData.sizes || [],
    });
  } else {
    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      colors: [],
      sizes: [],
      sale: 0,
      images: [],
    });
  }
}, [initialData]);


  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleMultiSelect(name, value) {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(v => v !== value)
        : [...prev[name], value],
    }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
  }

  function removeImage(idx) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `http://localhost:3001/api/products/${initialData._id}`
        : "http://localhost:3001/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save product");

      alert(initialData ? "Product updated successfully" : "Product added successfully");
      onAdded();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Product Images</label>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {(form.images || []).map((img, idx) => (
              <div key={idx} className="relative">
              <img src={img} alt="preview" className="w-20 h-20 object-cover rounded-lg border" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
              <AiOutlineClose size={14} />
            </button>
             </div>
            ))}

            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <AiOutlinePlus size={20} />
            </button>
            <input
              type="file"
              multiple
              className="hidden"
              ref={imageInputRef}
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name & Price */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Category */}
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Colors */}
          <div>
            <label className="block font-medium text-gray-600 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {["Red", "Blue", "Green", "Black"].map(color => (
                <button
                  type="button"
                  key={color}
                  className={`px-4 py-2 rounded-lg border font-medium ${
                    form.colors.includes(color)
                      ? "bg-gray-800 text-white border-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleMultiSelect("colors", color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block font-medium text-gray-600 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL"].map(size => (
                <button
                  type="button"
                  key={size}
                  className={`px-4 py-2 rounded-lg border font-medium ${
                    form.sizes.includes(size)
                      ? "bg-gray-800 text-white border-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleMultiSelect("sizes", size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sale */}
          <input
            type="number"
            name="sale"
            placeholder="Sale %"
            value={form.sale}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium"
            >
              {initialData ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
