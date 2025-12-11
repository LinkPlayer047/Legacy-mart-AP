"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "@/components/home/Home";
import Sidebar from "@/components/home/components/Sidebar";

export default function Page() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null; 

  return (
    <>
      {isLoggedIn ? (
        <Sidebar>
          <Home />
        </Sidebar>
      ) : (
        <Home /> 
      )}
    </>
  );
}
