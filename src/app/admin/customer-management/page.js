"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  ShoppingCart, 
  CheckCircle, 
  Clock,
  MapPin,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  MoreVertical
} from 'lucide-react'
import CustomerDetailView from '@/component/CustomerDetailView'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'detail'
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    status: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/customer-order').then((res) => res.json()).then((data) => {
      setCustomers(data.customer)
      setFilteredCustomers(data.customer)
      setLoading(false)
    })
  }, [])

  // Search functionality
  useEffect(() => {
    let results = customers

    // Apply search
    if (searchTerm) {
      results = results.filter(customer =>
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      )
    }

    // Apply filters
    if (filters.country) {
      results = results.filter(customer => customer.country === filters.country)
    }
    if (filters.city) {
      results = results.filter(customer => customer.city === filters.city)
    }
    if (filters.status) {
      const statusBool = filters.status === 'Verified'
      results = results.filter(customer => customer.done === statusBool)
    }

    setFilteredCustomers(results)
  }, [searchTerm, filters, customers])

  const StatusBadge = ({ done }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      done 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }`}>
      {done ? <CheckCircle className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
      {done ? 'Verified' : 'Pending'}
    </span>
  )

  
  if (loading) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (view === 'detail' && selectedCustomer) {
    return (
      <CustomerDetailView 
        customer={selectedCustomer} 
        onBack={() => {
          setView('list')
          setSelectedCustomer(null)
        }} 
      />
    )
  }

  // Get unique values for filters
  const countries = [...new Set(customers.map(c => c.country).filter(Boolean))]
  const cities = [...new Set(customers.map(c => c.city).filter(Boolean))]
  
  return (
  <>
 
      
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your customer database ({filteredCustomers.length} customers)
              </p>
            </div>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <select 
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select 
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
              </select>

              <button 
                onClick={() => {
                  setSearchTerm('')
                  setFilters({ country: '', city: '', status: '' })
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer, index) => (
                  <tr 
                    key={customer._id || index} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {customer.fullName?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {customer.oid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.city}, {customer.country}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge done={customer.done} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(customer.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setView('detail')
                          }}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Previous
                </button>
                <button className="px-3 py-2 border border-blue-600 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg">
              No customers found matching your criteria
            </div>
          </div>
        )}
      </div>
    </div>
     </>
  )
}

export default CustomersPage