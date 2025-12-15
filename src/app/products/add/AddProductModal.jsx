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
    images: [], // preview URLs or backend URLs
  });

  const [imageFiles, setImageFiles] = useState([]); // real files for upload
  const imageInputRef = useRef(null);

  // Prefill form if editing
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
        images: (initialData.images || []).map(img => img.url || img),
      });
      setImageFiles([]);
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
      setImageFiles([]);
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
    setImageFiles(prev => [...prev, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setForm(prev => ({ ...prev, images: [...prev.images, ...previews] }));
  }

  function removeImage(idx) {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));

    // Only remove actual file if it exists in imageFiles (new uploads)
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const method = initialData ? "PUT" : "POST";
      const baseURL = initialData ? `/api/products${initialData._id}` : `/api/products`;

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("sale", form.sale);

      form.colors.forEach(color => formData.append("colors[]", color));
      form.sizes.forEach(size => formData.append("sizes[]", size));
      imageFiles.forEach(file => formData.append("images", file));

      const res = await fetch(baseURL, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save product");

      alert(initialData ? "Product updated successfully" : "Product added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
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
            {form.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img || "/placeholder.png"}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={e => (e.currentTarget.src = "/placeholder.png")}
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
            <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required className="flex-1 border border-gray-300 rounded-xl p-3" />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="flex-1 border border-gray-300 rounded-xl p-3" />
          </div>
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 h-28 resize-none" />

          {/* Colors */}
          <div>
            <label className="block font-medium text-gray-600 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {["Red", "Blue", "Green", "Black"].map(color => (
                <button key={color} type="button" onClick={() => handleMultiSelect("colors", color)} className={`px-4 py-2 rounded-lg border ${form.colors.includes(color) ? "bg-gray-800 text-white" : "border-gray-300"}`}>
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
                <button key={size} type="button" onClick={() => handleMultiSelect("sizes", size)} className={`px-4 py-2 rounded-lg border ${form.sizes.includes(size) ? "bg-gray-800 text-white" : "border-gray-300"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <input type="number" name="sale" placeholder="Sale %" value={form.sale} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl bg-gray-200">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-green-600 text-white">{initialData ? "Update Product" : "Save Product"}</button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
