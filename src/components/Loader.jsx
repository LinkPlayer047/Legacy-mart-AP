"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <img
        src="/legacy-logo.png"
        alt="Loading..."
        className="w-32 h-32 animate-pulse" // size adjust kar sakte ho
      />
    </div>
  );
}
