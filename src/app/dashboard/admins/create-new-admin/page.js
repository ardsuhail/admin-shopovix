"use client"
import React, { useState } from 'react'
import { FiUser, FiMail, FiLock, FiLoader, FiPlus, FiShield, FiCheck, FiAlertCircle } from 'react-icons/fi'

const CreateAdminPage = () => {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!form.userName.trim()) {
      newErrors.userName = 'Username is required'
    } else if (form.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters'
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email format is invalid'
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numbers'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccess(false)

    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        "userName": form.userName,
        "email": form.email,
        "password": form.password
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      }

      const response = await fetch("/api/create-new-admin", requestOptions)
      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setForm({
          userName: '',
          email: '',
          password: '',
        })
        // Auto hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000)
      } else {
        alert(result.message || "Failed to create admin account")
      }
    } catch (error) {
      alert(error.message || "Network error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-emerald-500']
    
    return {
      strength: (strength / 6) * 100,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-500'
    }
  }

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
              <FiPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Create Admin Account
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            admin.shopovix.store • Super Admin Access Required
          </p>
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-200 text-xs font-medium flex items-center justify-center">
              <FiShield className="h-3 w-3 mr-1" />
              ⚠️ This action creates a new administrator with full system access
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 animate-in fade-in duration-300">
            <div className="flex items-center space-x-2 text-green-200">
              <FiCheck className="h-5 w-5" />
              <span className="font-semibold">Admin account created successfully!</span>
            </div>
            <p className="text-green-300 text-sm mt-1">
              The new administrator can now access the admin panel.
            </p>
          </div>
        )}

        {/* Create Admin Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/15">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-200">
                <FiUser className="h-4 w-4 mr-2" />
                Admin Username
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="userName"
                  value={form.userName}
                  placeholder="Enter admin username"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.userName ? 'border-red-400' : 'border-white/20'
                  }`}
                  disabled={isLoading}
                />
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {errors.userName && (
                <p className="text-red-300 text-sm flex items-center animate-pulse">
                  <FiAlertCircle className="h-3 w-3 mr-1" />
                  {errors.userName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-200">
                <FiMail className="h-4 w-4 mr-2" />
                Admin Email
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="admin@shopovix.store"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-400' : 'border-white/20'
                  }`}
                  disabled={isLoading}
                />
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm flex items-center animate-pulse">
                  <FiAlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-200">
                <FiLock className="h-4 w-4 mr-2" />
                Admin Password
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Create secure password"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-400' : 'border-white/20'
                  }`}
                  disabled={isLoading}
                />
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              
              {/* Password Strength Meter */}
              {form.password && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Password Strength:</span>
                    <span className={passwordStrength.label === 'Very Weak' || passwordStrength.label === 'Weak' ? 'text-red-300' : 
                                     passwordStrength.label === 'Fair' ? 'text-yellow-300' : 'text-green-300'}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-300 text-sm flex items-center animate-pulse">
                  <FiAlertCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm font-medium text-gray-200 mb-2">Password Requirements:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li className={`flex items-center ${form.password.length >= 8 ? 'text-green-300' : ''}`}>
                  <FiCheck className={`h-3 w-3 mr-2 ${form.password.length >= 8 ? 'text-green-300' : 'text-gray-500'}`} />
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(form.password) ? 'text-green-300' : ''}`}>
                  <FiCheck className={`h-3 w-3 mr-2 ${/(?=.*[a-z])/.test(form.password) ? 'text-green-300' : 'text-gray-500'}`} />
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(form.password) ? 'text-green-300' : ''}`}>
                  <FiCheck className={`h-3 w-3 mr-2 ${/(?=.*[A-Z])/.test(form.password) ? 'text-green-300' : 'text-gray-500'}`} />
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(form.password) ? 'text-green-300' : ''}`}>
                  <FiCheck className={`h-3 w-3 mr-2 ${/(?=.*\d)/.test(form.password) ? 'text-green-300' : 'text-gray-500'}`} />
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  <span>Creating Admin Account...</span>
                </>
              ) : (
                <>
                  <FiPlus className="h-5 w-5" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-gray-400">
              🔐 New admins will receive login credentials via email
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Shopovix Store • Admin Management System
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
      </div>
    </div>
  )
}

export default CreateAdminPage