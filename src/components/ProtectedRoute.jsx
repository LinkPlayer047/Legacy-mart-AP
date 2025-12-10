"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Checking Authentication...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
