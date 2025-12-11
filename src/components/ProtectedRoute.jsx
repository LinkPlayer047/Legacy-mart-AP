"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
