"use client";
import { useEffect, useState } from "react";
import UsersTable from "./UserTable";
import Sidebar from "@/components/home/components/Sidebar";

export default function WebsiteUsersPage() {
  const [users, setUsers] = useState([]);
  
    const [loading, setLoading] = useState(true);
  
    async function loadProducts() {
      try {
        setLoading(true); // 🔥 show loader
        const res = await fetch("https://legacy-mart.vercel.app/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false); // 🔥 hide loader
      }
    }


  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken"); // use localStorage instead of cookie
    const res = await fetch("https://legacy-mart.vercel.app/api/users", {
      headers: { Authorization: `Bearer ${token}` },
  });

    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Sidebar>
      <div>
        <h1 className="text-2xl font-bold mb-4">Website Users</h1>
        <UsersTable users={users} refresh={fetchUsers} />
      </div>
    </Sidebar>
  );
}
