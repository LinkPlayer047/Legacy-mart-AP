"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) return null; // token check hone tak kuch render mat karo
  return <>{children}</>;
};

export default ProtectedRoute;
