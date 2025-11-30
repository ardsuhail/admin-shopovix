"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Users, ShoppingBag, Bell, Star, Image, ChevronRight, ChevronUp, ChevronDown, 
  LayoutDashboard, MessageSquare, UserPlus, Settings, Eye, BarChart3, Ticket,Tags,Tag,ImagePlus,Images
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [showCoupon, setShowCoupon] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showViews, setShowViews] = useState(false)
  const [showBanner, setShowBanner] = useState(false)  

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Customers", icon: <Users size={20} />, href: "/dashboard/customer-management" },
    { name: "Orders", icon: <ShoppingBag size={20} />, href: "/dashboard/orders" },
    { name: "Store Subscribers", icon: <Bell size={20} />, href: "/dashboard/subscribers" },
    { name: "All Product Reviews", icon: <Star size={20} />, href: "/dashboard/your-reviews" },
    { name: "Customer Queries", icon: <MessageSquare size={20} />, href: "/dashboard/customer-queries" }
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
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={handleCloseClick}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-72 lg:w-64 xl:w-72 h-screen
          bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
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
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
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
                      ${isActive ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                </li>
              );
            })}

            {/* setshow admin */}
              <li className="cursor-pointer" onClick={()=>setShowAdmin(!showAdmin)} >
                   <div className=" flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative" >

                
                    <div className="flex items-center gap-3">
                      <div className={`text-gray-400 group-hover:text-white
                      `}>
                        <Settings size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Manage Admin</span>
                    </div>
                    
                    <div className={`
                     opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    `}>
                     {showAdmin?<ChevronDown size={16} className="text-gray-400" />:<ChevronRight size={16} className="text-gray-400" />} 
                    </div>
                  
                
                   </div>
                </li>
                  <li className="relative left-5 mr-2 " >
                  {showAdmin &&  <>
                 <Link
                    href={"/dashboard/admins/create-new-admin"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/admins/create-new-admin"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/admins/create-new-admin" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <UserPlus size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Add New Admin</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/admins/create-new-admin" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                 <Link
                    href={"/dashboard/admins/manage-store-admins"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/admins/manage-store-admins"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/admins/manage-store-admins" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <Settings size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Manage Admin</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/admins/manage-store-admins" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                </>  }
                </li>
                {/* setshowviews */}
              <li className="cursor-pointer" onClick={()=>setShowViews(!showViews)} >
                   <div className=" flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative" >

                
                    <div className="flex items-center gap-3">
                      <div className={`text-gray-400 group-hover:text-white
                      `}>
                        <Eye size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Store Views</span>
                    </div>
                    
                    <div className={`
                     opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    `}>
                     {showViews?<ChevronDown size={16} className="text-gray-400" />:<ChevronRight size={16} className="text-gray-400" />} 
                    </div>
                  
                
                   </div>
                </li>
                <li className="relative left-5 mr-2 " >
                  {showViews &&  <>
                 <Link
                    href={"/dashboard/store-views/analytics"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/Coupon/create"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/store-views/analytics" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <BarChart3 size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Analytics</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/store-views/analytics" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                 <Link
                    href={"/dashboard/store-views/live-views"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/store-views/live-views"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/store-views/live-views" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <Eye size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Live Views</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/store-views/live-views" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                </>  }
                </li>



              <li className="cursor-pointer" onClick={()=>setShowCoupon(!showCoupon)} >
                   <div className=" flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative" >

                
                    <div className="flex items-center gap-3">
                      <div className={`text-gray-400 group-hover:text-white
                      `}>
                        <Ticket size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Coupons</span>
                    </div>
                    
                    <div className={`
                     opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    `}>
                     {showCoupon?<ChevronDown size={16} className="text-gray-400" />:<ChevronRight size={16} className="text-gray-400" />} 
                    </div>
                  
                
                   </div>
                </li>
                <li className="relative left-5 mr-2 " >
                  {showCoupon &&  <>
                 <Link
                    href={"/dashboard/Coupon/create"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/Coupon/create"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/Coupon/create" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <Tag size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Create Coupon</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/Coupon/create" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                 <Link
                    href={"/dashboard/Coupon/coupon-management"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/Coupon/coupon-management"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/Coupon/coupon-management" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <Tags size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Manage Coupons</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/Coupon/coupon-management" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                </>  }
                </li>

                
                 {/* banners */}

                   <li className="cursor-pointer" onClick={()=>setShowBanner(!showBanner)} >
                   <div className=" flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative" >

                
                    <div className="flex items-center gap-3">
                      <div className={`text-gray-400 group-hover:text-white
                      `}>
                        <Image size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Banner</span>
                    </div>
                    
                    <div className={`
                     opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    `}>
                     {showBanner?<ChevronDown size={16} className="text-gray-400" />:<ChevronRight size={16} className="text-gray-400" />} 
                    </div>
                  
                
                   </div>
                </li>
                <li className="relative left-5 mr-2 " >
                  {showBanner &&  <>
                 <Link
                    href={"/dashboard/banner/add"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/banner/add"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/banner/add" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <ImagePlus size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Add Banner</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/banner/add" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                 <Link
                    href={"/dashboard/banner/allBanners"}
                    
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 
                      transition-all duration-200 rounded-xl mx-1
                      group relative
                      ${pathname ===  "/dashboard/banner/allBanners"
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500" 
                        : "hover:bg-gray-750 text-gray-300 hover:text-white"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${pathname ===  "/dashboard/banner/allBanners" ? "text-blue-400" : "text-gray-400 group-hover:text-white"}
                      `}>
                        <Images size={20} />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">Manage Banners</span>
                    </div>
                    
                    <div className={`
                      ${pathname ===  "/dashboard/banner/allBanners" ? "opacity-100" : " opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                    `}>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                </>  }
                </li>
             <button
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        localStorage.removeItem("notlogin"); 
        window.location.href = "/login";
      }}
      className="mt-4 bg-red-500 w-full text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
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