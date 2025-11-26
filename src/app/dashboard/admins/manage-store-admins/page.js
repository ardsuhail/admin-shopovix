"use client";
import { useState, useEffect } from "react";
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, FiMail, FiUser, FiShield } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
const StoreAdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Fixed fetch function - yeh add karo
  const fetchAdmins = async () => {
    setLoading(true)
    // fetchCoupons();
    fetch('/api/create-new-admin').then((res) => res.json()).then((data) => {
      setLoading(false)
      setAdmins(data.admins)
    }).catch((err) => {
      setLoading(false)
      console.error("Error fetching coupons:", err);
      toast.error("Error fetching admins");
    })
  };

  useEffect(() => {
    fetchAdmins();
  }, []);




  // Delete admin - Fixed
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      const response = await fetch(`/api/store-admins/delete-admin`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId: selectedAdmin._id })
      });

      const data = await response.json();

      // YEH LINE CHECK KARO - success ki spelling sahi hai?
      if (data.success) { // success (double 's') check karo
        setShowDeleteModal(false);
        toast.success("Admin deleted successfully!");
        setSelectedAdmin(null);
        fetchAdmins(); // List refresh karo
      } else {
        toast.error(data.message || "Failed to delete admin");
      }
    } catch (error) {
      toast.error("Error deleting admin");
      console.error("Delete error:", error);
    }
  };

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin =>
    admin.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open delete confirmation modal
  // const openDeleteModal = (admin) => {
  //   setSelectedAdmin(admin);
  //   setShowDeleteModal(true);
  // };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="lg:w-[75vw] w-full min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className=" relative lg:w-[75vw] w-full min-h-screen bg-gray-50 p-4 lg:p-6">
      <Toaster  position="top-right"/>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiUsers className="text-blue-600" />
              Store Admin Management
            </h1>
            <p className="text-gray-600 mt-2">Manage store administrators and their permissions</p>
          </div>
          <Link href={"/dashboard/admins/create-new-admin"}

            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <FiPlus size={20} />
            Add New Admin
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{admins.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{admins.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiShield className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {admins.length > 0 ? formatDate(admins[0].updatedAt) : "N/A"}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiUser className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {admin.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {admin.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Administrator
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      <FiMail size={14} className="text-gray-400" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {setSelectedAdmin(admin);
                                       setShowDeleteModal(true);}
                                      }
                      className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Delete Admin"
                      >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
                </tr>
              ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">No admins found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first admin"}
            </p>
          </div>
        )}
      </div>
    </div>

      {/* Add Admin Modal */ }


  {/* Delete Confirmation Modal */ }
  {
    showDeleteModal && (
      <div className="fixed bg-black/80 inset-0 lg:left-58  bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Delete Admin</h2>
            <p className="text-gray-600 mt-1">This action cannot be undone</p>
          </div>

          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="text-red-600" />
                </div>
                <div>
                  <p className="text-red-800 font-medium">
                    Delete {selectedAdmin.userName}?
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    This will permanently remove this admin account
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  handleDeleteAdmin        
                  
                }
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
    </div >
  );
};

export default StoreAdminManagement;