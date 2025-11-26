"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { FaStore, FaBars, FaTimes, FaShoppingCart, FaEnvelope } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
   const [token, setToken] = useState(null)
   useEffect(() => {
   const token1=localStorage.getItem("notlogin")
   setToken(token1)
   }, [])
   
  return (
    <nav className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <FaStore className="text-lg text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-tight">Shopovix</span>
            <span className="text-xs text-blue-600 font-medium">Admin Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-sm group">
            <FaStore className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            Home
          </Link>
          
          <a 
            href="https://shopovix.store" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-sm group"
          >
            <FaShoppingCart className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            Main Store
          </a>
          
          <Link href="/contact" className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-sm group">
            <FaEnvelope className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            Contact
          </Link>
          
          <div className="ml-4 pl-4 border-l border-gray-200">
          {token?(
              <Link 
              href="/dashboard" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <FaStore className="text-sm" />
              Admin Dashboard
            </Link>
          ):(
<Link 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <FaStore className="text-sm" />
              Admin Login
            </Link>
          
          )}  
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            {isOpen ? <FaTimes className="text-lg text-gray-700" /> : <FaBars className="text-lg text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-base">
              <FaStore className="text-gray-500 text-lg" />
              Home
            </Link>
            
            <a 
              href="https://shopovix.store" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-base"
            >
              <FaShoppingCart className="text-gray-500 text-lg" />
              Main Store
            </a>
            
            <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-base">
              <FaEnvelope className="text-gray-500 text-lg" />
              Contact
            </Link>
            
            <div className="pt-3 border-t border-gray-200 mt-3">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <FaStore className="text-sm" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}