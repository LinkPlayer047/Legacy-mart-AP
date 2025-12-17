"use client";
import { useEffect, useState } from "react";
import UsersTable from "./UserTable";
import Sidebar from "@/components/home/components/Sidebar";

export default function WebsiteUsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = document.cookie
      .split("; ")
      .find(r => r.startsWith("adminToken="))
      ?.split("=")[1];

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
