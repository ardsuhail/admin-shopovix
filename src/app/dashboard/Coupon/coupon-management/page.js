"use client";
import { useState, useEffect } from "react";
import { 
  Tag, 
  Search, 
  Filter, 
  Edit3, 
  ToggleLeft, 
  ToggleRight, 
  Calendar,
  Percent,
  IndianRupee,
  ShoppingCart,
  Zap,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export default function CouponsManagementPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive, expired
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true)
    // fetchCoupons();
    fetch('/api/coupon/create').then((res)=>res.json()).then((data)=>{
      setLoading(false)
      setCoupons(data.coupons)
    }).catch((err)=>{
      setLoading(false)
       console.error("Error fetching coupons:", err);
      setMessage("❌ Failed to load coupons");
    })
  }, []);

  // const fetchCoupons = async () => {
  //   try {
  //     const res = await fetch("/api/coupon");
  //     const data = await res.json();
  //     setCoupons(data.coupons || []);
  //   } catch (error) {
  //     console.error("Error fetching coupons:", error);
  //     setMessage("❌ Failed to load coupons");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
   
  const toggleCouponStatus = async (couponId, currentStatus) => {
    try {
      const res = await fetch("/api/coupon/toggle-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          couponId, 
          isActive: !currentStatus 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCoupons(coupons.map(coupon => 
          coupon._id === couponId 
            ? { ...coupon, isActive: !currentStatus }
            : coupon
        ));
        setMessage(`✅ Coupon ${!currentStatus ? "activated" : "deactivated"} successfully`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to update coupon status");
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch("/api/coupon/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId }),
      });

      const data = await res.json();

      if (res.ok) {
        setCoupons(coupons.filter(coupon => coupon._id !== couponId));
        setMessage("✅ Coupon deleted successfully");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to delete coupon");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage("✅ Coupon code copied to clipboard!");
  };

  const getStatusBadge = (coupon) => {
    const isExpired = new Date(coupon.expiresAt) < new Date();
    
    if (isExpired) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Expired
        </span>
      );
    }
    
    if (!coupon.isActive) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium flex items-center gap-1">
          <ToggleLeft className="w-3 h-3" />
          Inactive
        </span>
      );
    }
    
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Active
      </span>
    );
  };

  const getDaysRemaining = (expiresAt) => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const isExpired = new Date(coupon.expiresAt) < new Date();
    
    switch (filter) {
      case "active":
        return matchesSearch && coupon.isActive && !isExpired;
      case "inactive":
        return matchesSearch && !coupon.isActive && !isExpired;
      case "expired":
        return matchesSearch && isExpired;
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manage Coupons
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            View, manage, and track all your promotional coupons in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                <p className="text-sm text-gray-600">Total Coupons</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {coupons.filter(c => c.isActive && new Date(c.expiresAt) > new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {coupons.filter(c => !c.isActive && new Date(c.expiresAt) > new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Inactive</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <ToggleLeft className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {coupons.filter(c => new Date(c.expiresAt) < new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Expired</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === "all" 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === "active" 
                    ? "bg-green-600 text-white shadow-sm" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("inactive")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === "inactive" 
                    ? "bg-gray-600 text-white shadow-sm" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => setFilter("expired")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === "expired" 
                    ? "bg-red-600 text-white shadow-sm" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl border ${
            message.includes("✅") 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {message.includes("✅") ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message}</span>
              </div>
              <button onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Coupons Grid */}
        {filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by creating your first coupon"
              }
            </p>
            <button 
              onClick={() => window.location.href = "/admin/coupons/create"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Create New Coupon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div key={coupon._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Coupon Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{coupon.code}</h3>
                    {getStatusBadge(coupon)}
                  </div>
                </div>

                {/* Coupon Body */}
                <div className="p-6">
                  {/* Discount Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {coupon.discountType === "percentage" ? (
                          <>{coupon.discountValue}% OFF</>
                        ) : (
                          <>₹{coupon.discountValue} OFF</>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <ShoppingCart className="w-4 h-4" />
                        Min. order: ₹{coupon.minOrderAmount || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        {getDaysRemaining(coupon.expiresAt)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(coupon.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          coupon.isActive 
                            ? "bg-orange-100 text-orange-600 hover:bg-orange-200" 
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title={coupon.isActive ? "Deactivate" : "Activate"}
                      >
                        {coupon.isActive ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all duration-200"
                        title="Copy code"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => deleteCoupon(coupon._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create New Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = "/admin/coupons/create"}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
          >
            <Tag className="w-5 h-5" />
            Create New Coupon
          </button>
        </div>
      </div>
    </div>
  );
}