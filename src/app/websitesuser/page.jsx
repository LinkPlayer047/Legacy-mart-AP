"use client";

import { useEffect, useState } from "react";
import UsersTable from "./UserTable";
import Sidebar from "@/components/home/components/Sidebar";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";

export default function WebsiteUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken"); // get token from localStorage
      const res = await fetch("https://legacy-mart.vercel.app/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loader />; // show loader while fetching

  return (
    <Sidebar>
      <div>
        <h1 className="text-2xl font-bold mb-4">Website Users</h1>
        <UsersTable users={users} refresh={fetchUsers} />
      </div>
    </Sidebar>
  );
}
