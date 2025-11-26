"use client";
import { useState } from "react";
import { 
  Tag, 
  Plus, 
  Percent, 
  IndianRupee, 
  Calendar,
  ShoppingCart,
  Shield,
  Zap
} from "lucide-react";

export default function AddCouponPage() {
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createCoupon = async () => {
    if (!form.code || !form.discountValue || !form.expiresAt) {
      setMsg("❌ Please fill all required fields");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/coupon/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(`❌ ${data.error}`);
      } else {
        setMsg("✅ Coupon Created Successfully!");
        setForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrderAmount: "",
          expiresAt: "",
        });
      }
    } catch (e) {
      setMsg("❌ Server error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Coupon
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Design attractive discount coupons to boost your sales and customer engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Instant</p>
                <p className="text-sm text-gray-600">Activation</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Secure</p>
                <p className="text-sm text-gray-600">Validation</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Flexible</p>
                <p className="text-sm text-gray-600">Usage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Coupon Details</h2>
            </div>
            <p className="text-blue-100 mt-2">Fill in the details to create your promotional coupon</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Message Alert */}
            {msg && (
              <div className={`mb-6 p-4 rounded-2xl border ${
                msg.includes("✅") 
                  ? "bg-green-50 border-green-200 text-green-800" 
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
                <div className="flex items-center gap-2">
                  {msg.includes("✅") ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                  )}
                  <span className="font-medium">{msg}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Coupon Code *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="SUMMER50"
                      maxLength="20"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Tag className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Unique code customers will use at checkout</p>
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Discount Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, discountType: "percentage" })}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                        form.discountType === "percentage"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          form.discountType === "percentage" ? "bg-blue-500" : "bg-gray-100"
                        }`}>
                          <Percent className={`w-4 h-4 ${
                            form.discountType === "percentage" ? "text-white" : "text-gray-600"
                          }`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Percentage</p>
                          <p className="text-xs text-gray-600">% Off</p>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, discountType: "flat" })}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                        form.discountType === "flat"
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          form.discountType === "flat" ? "bg-green-500" : "bg-gray-100"
                        }`}>
                          <IndianRupee className={`w-4 h-4 ${
                            form.discountType === "flat" ? "text-white" : "text-gray-600"
                          }`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Flat Amount</p>
                          <p className="text-xs text-gray-600">₹ Off</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {form.discountType === "percentage" ? (
                      <Percent className="w-4 h-4 text-blue-600" />
                    ) : (
                      <IndianRupee className="w-4 h-4 text-green-600" />
                    )}
                    Discount Value *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountValue"
                      value={form.discountValue}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder={form.discountType === "percentage" ? "50" : "200"}
                      min="0"
                      max={form.discountType === "percentage" ? "100" : "10000"}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {form.discountType === "percentage" ? (
                        <Percent className="w-5 h-5 text-gray-400" />
                      ) : (
                        <IndianRupee className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {form.discountType === "percentage" ? "%" : "₹"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Minimum Order Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                    Minimum Order Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={form.minOrderAmount}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="500"
                      min="0"
                    />
                  
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Set 0 for no minimum order requirement</p>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Expiry Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expiresAt"
                      value={form.expiresAt}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    Coupon Preview
                  </h3>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-gray-900">
                          {form.code || "COUPONCODE"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {form.discountValue 
                            ? `${form.discountValue}${form.discountType === "percentage" ? "%" : "₹"} OFF`
                            : "Discount"
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Min. Order</p>
                        <p className="font-semibold text-gray-900">
                          ₹{form.minOrderAmount || "0"}
                        </p>
                      </div>
                    </div>
                    {form.expiresAt && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Valid until: {new Date(form.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={createCoupon}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Coupon...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Coupon
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            💡 Coupons will be automatically validated and applied at checkout
          </p>
        </div>
      </div>
    </div>
  );
}