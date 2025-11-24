"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Users, ShoppingBag, Bell, Star, Image, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <Users size={20} />, href: "/dashboard" },
    { name: "Customers", icon: <Users size={20} />, href: "/dashboard/customer-management" },
    { name: "Orders", icon: <ShoppingBag size={20} />, href: "/dashboard/orders" },
    { name: "Store Subscribers", icon: <Bell size={20} />, href: "/dashboard/subscribers" },
    { name: "All Product Reviews", icon: <Star size={20} />, href: "/dashboard/your-reviews" },
    { name: "Store Banners", icon: <Image size={20} />, href: "/dashboard/banner/allBanners" },
    { name: "Add New Banner", icon: <Image size={20} />, href: "/dashboard/banner/add" },
    { name: "Customer Queries", icon: <Image size={20} />, href: "/dashboard/customer-queries" },
    { name: "Create New Admin", icon: <Image size={20} />, href: "/dashboard/create-new-admin" }
  ];

  // Simple handlers - no complex logic
  const handleMenuClick = () => setOpen(true);
  const handleCloseClick = () => setOpen(false);
  const handleLinkClick = () => setOpen(false);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden z-50 fixed top-0 w-full h-16 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        <button 
          onClick={handleMenuClick}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleCloseClick}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-72 lg:w-64 xl:w-72 h-screen
          bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl
          transform transition-all duration-300 ease-in-out
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          border-r border-gray-700
        `}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-700 bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
            <p className="text-xs text-gray-400 mt-1">Dashboard</p>
          </div>
          <button 
            onClick={handleCloseClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${isActive 
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        {item.icon}
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
                    </div>
                    
                    <div className={`
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                </li>
              );
            })}
             <button
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        localStorage.removeItem("notlogin"); 
        window.location.href = "/login";
      }}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
    >
      Logout
    </button>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-gray-700 bg-gray-900/30">
          <div className="text-center">
            <p className="text-xs text-gray-400">Admin Panel v1.0</p>
            <p className="text-xs text-gray-500 mt-1">© 2024 shopovix</p>
          </div>
        </div>
      </div>
    </>
  );
}