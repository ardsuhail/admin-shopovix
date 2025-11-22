// app/subscribers/page.jsx
"use client"
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Trash2, 
  Users, 
  Mail, 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  Loader2
} from 'lucide-react'

const Page = () => {
  const [subscribers, setSubscribers] = useState([])
  const [filteredSubscribers, setFilteredSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const subscribersPerPage = 10
  // Use environment variable if present, otherwise fall back to current origin (helps in production if NEXT_PUBLIC_API_BASE wasn't set)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || (typeof window !== 'undefined' ? window.location.origin : '')

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/subscriber`)
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`Fetch failed: ${res.status} ${res.statusText} ${text}`)
        }
        const data = await res.json()
        setSubscribers(data.subscribers || [])
        setFilteredSubscribers(data.subscribers || [])
      } catch (error) {
        console.error('Error fetching subscribers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscribers()
  }, [])
 console.log("subscribers",`/api/subscriber`)
 console.log("email",subscribers.email)
 
  // Filter subscribers based on search
  useEffect(() => {
    const filtered = subscribers.filter(subscriber =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSubscribers(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, subscribers])

  // Delete subscriber
  const handleDelete = async (subscriberId, subscriberEmail) => {
    setDeleteLoading(subscriberId)
    try {
      const res = await fetch(`/api/subscriber?id=${subscriberId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        // Remove from local state
        setSubscribers(prev => prev.filter(sub => sub._id !== subscriberId))
        setShowDeleteConfirm(null)
      } else {
        const text = await res.text().catch(() => '')
        console.error('Failed to delete subscriber', res.status, res.statusText, text)
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error)
    } finally {
      setDeleteLoading(null)
    }
  }

  // Pagination calculations
  const indexOfLastSubscriber = currentPage * subscribersPerPage
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber)
  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage)

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full lg:w-[75vw] bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Subscribers</h1>
            <p className="text-gray-600 mt-2">Manage your store's subscriber list</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
              <div className="flex items-center">
                <div className="bg-green-50 rounded-xl p-3 mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {currentSubscribers.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Subscription Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentSubscribers.map((subscriber) => (
                    <tr 
                      key={subscriber._id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(subscriber.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setShowDeleteConfirm(subscriber._id)}
                          disabled={deleteLoading === subscriber._id}
                          className="inline-flex items-center px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          {deleteLoading === subscriber._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <div className="p-4 space-y-4">
                {currentSubscribers.map((subscriber) => (
                  <div 
                    key={subscriber._id} 
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {subscriber.email}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(subscriber.createdAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(subscriber._id)}
                        disabled={deleteLoading === subscriber._id}
                        className="ml-4 inline-flex items-center p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        {deleteLoading === subscriber._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No subscribers found' : 'No subscribers yet'}
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Subscribers will appear here once they sign up for your newsletter.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredSubscribers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstSubscriber + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastSubscriber, filteredSubscribers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredSubscribers.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Subscriber</h3>
                <p className="text-gray-600 mt-1">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this subscriber? They will be removed from your mailing list permanently.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteLoading === showDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
              >
                {deleteLoading === showDeleteConfirm ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page