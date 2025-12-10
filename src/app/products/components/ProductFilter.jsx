"use client";
import { useState } from "react";

export default function ProductFilter({ onFilter }) {
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    setSearch(e.target.value);
    onFilter(e.target.value);
  }

  return (
    <div className="mb-4 flex gap-2 items-center">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search products..."
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
