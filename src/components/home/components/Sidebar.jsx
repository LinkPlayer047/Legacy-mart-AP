"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = ({ children }) => {
  const [sidebarOpen, setSidebaropen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
  setLoggingOut(true); // 🔥 Loader start
  document.cookie = "adminToken=; path=/; max-age=0"; // delete cookie
  localStorage.removeItem("adminToken"); // ✅ optional for localStorage
  setTimeout(() => {
    setLoggingOut(false); // 🔥 Loader stop (redirect se pehle optional)
    router.push("/login");
  }, 300); // 300ms optional delay for smooth UX
};


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

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Products", path: "/products", icon: "📦" },
    { name: "Categories", path: "/category", icon: "🗂️" },
    { name: "Orders", path: "/orders", icon: "🛒" },
    { name: "Websiteusers", path: "/websitesuser", icon: "👥" },
  ];

  if (!authorized) return null;

  return (
    <>
    {loggingOut && <Loader />}
    <div className="flex h-screen">
      <aside
        id="sidebar"
        className={`
          fixed inset-y-0 left-0 z-40 bg-white text-black shadow-xl
          transition-all duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="flex items-center justify-between border-b border-b-gray-600 p-4">
          <span className={`font-bold text-xl ${collapsed ? "hidden" : "block"}`}>
            <img src="/legacy-logo.png" alt="" />
          </span>
          <button className=" md:hidden text-xl text-white" onClick={() => setSidebaropen(false)}>
            ✕
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full py-2 bg-white text-sm mb-3 transition hover:text-blue-500 hover:bg-blue-500/20"
        >
          {collapsed ? "➤" : "⟨⟨"}
        </button>

        <nav className="flex flex-col gap-1 py-2">
          {menuItems.map((items) => {
            const active = pathname === items.path;
            return (
              <Link
                key={items.path}
                href={items.path}
                onClick={() => setSidebaropen(false)}
                className={`flex items-center gap-3 px-4 py-2 hover:bg-blue-500/20 transition 
                  ${active ? "bg-white shadow-lg" : ""}`}
              >
                <span className="text-lg">{items.icon}</span>
                {!collapsed && (
                  <span className="font-medium text-black hover:text-blue-500">{items.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-20 py-2 hidden md:flex items-end border-t border-t-gray-600 justify-center bg-white text-sm transition hover:text-red-500 hover:bg-red-500/20"
        >
          {collapsed ? "↩" : ""}
          <span className="ml-2 font-bold">{collapsed ? "" : "Logout"}</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
         onClick={() => setSidebaropen(false)}
         className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}


      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <header className="flex items-center justify-between bg-white shadow-lg px-5 md:p-4 backdrop-blur-lg">
          <button
            id="sidebar-toggle"
            className="m-4 py-2 px-3 bg-white text-black hover:bg-blue-500/20 hover:text-blue-500 rounded md:hidden"
            onClick={() => setSidebaropen(!sidebarOpen)}
          >
            ☰
          </button>
          <span></span>
          <button
            onClick={handleLogout}
            className="flex items-center md:m-4 md:hidden gap-2 bg-blue-500 px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <span className="text-white">Logout</span>
          </button>
        </header>
        <main className="flex-1 h-screen p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
