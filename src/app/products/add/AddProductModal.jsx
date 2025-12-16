"use client";

import { useState, useRef, useEffect } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-hot-toast"; // Professional toast library

export default function AddProductModal({ isOpen, onClose, onAdded, initialData }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    colors: [],
    sizes: [],
    sale: 0,
  });

  const [existingImages, setExistingImages] = useState([]); // DB images
  const [newImages, setNewImages] = useState([]); // Files
  const imageInputRef = useRef(null);

  // Prefill (Edit mode)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        category: initialData.category || "",
        description: initialData.description || "",
        colors: initialData.colors || [],
        sizes: initialData.sizes || [],
        sale: initialData.sale || 0,
      });

      setExistingImages(initialData.images?.map(img => ({ url: img.url || img })) || []);
      setNewImages([]);
    } else {
      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        colors: [],
        sizes: [],
        sale: 0,
      });
      setExistingImages([]);
      setNewImages([]);
    }
  }, [initialData, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    setNewImages(prev => [...prev, ...files]);
  }

  function removeExistingImage(idx) {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  }

  function removeNewImage(idx) {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `https://legacy-mart.vercel.app/api/products/${initialData._id}`
        : `https://legacy-mart.vercel.app/api/products`;

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("sale", form.sale);

      form.colors.forEach(c => formData.append("colors[]", c));
      form.sizes.forEach(s => formData.append("sizes[]", s));
      newImages.forEach(file => formData.append("images", file));
      existingImages.forEach(img => formData.append("existingImages[]", img.url));

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save product");

      toast.success(initialData ? "Product updated successfully" : "Product added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Product Images</label>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">

            {/* Existing Images */}
            {existingImages.map((img, idx) => (
              <div key={`old-${idx}`} className="relative">
                <img
                  src={img.url}
                  alt="product"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <AiOutlineClose size={14} />
                </button>
              </div>
            ))}

            {/* New Images */}
            {newImages.map((file, idx) => (
              <div key={`new-${idx}`} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
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
              ref={imageInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded-xl p-3"
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded-xl p-3"
            />
          </div>

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 h-28 resize-none"
          />

          {/* Colors */}
          <div>
            <label className="block font-medium text-gray-600 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {["Red", "Blue", "Green", "Black"].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleMultiSelect("colors", color)}
                  className={`px-4 py-2 rounded-lg border ${
                    form.colors.includes(color)
                      ? "bg-gray-800 text-white"
                      : "border-gray-300"
                  }`}
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
                  key={size}
                  type="button"
                  onClick={() => handleMultiSelect("sizes", size)}
                  className={`px-4 py-2 rounded-lg border ${
                    form.sizes.includes(size)
                      ? "bg-gray-800 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <input
            type="number"
            name="sale"
            placeholder="Sale %"
            value={form.sale}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-green-600 text-white"
            >
              {initialData ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
