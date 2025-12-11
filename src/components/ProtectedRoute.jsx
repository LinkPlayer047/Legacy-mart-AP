"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) return null;
  if (!authorized) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
