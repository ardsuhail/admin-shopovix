"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Shield,
  Star,
  Archive,
  Trash2,
  Send
} from "lucide-react";

const AdminQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [selectedQueries, setSelectedQueries] = useState([]);

  // Fetch queries from API
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/query");
      const data = await response.json();
      
      if (data.success) {
        setQueries(data.queries || []);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter queries based on search and filter
  const filteredQueries = queries.filter(query => {
    const matchesSearch = 
      query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      selectedFilter === "all" ||
      (selectedFilter === "unread" && !query.read) ||
      (selectedFilter === "order-issue" && query.subject === "order-issue") ||
      (selectedFilter === "product-info" && query.subject === "product-info") ||
      (selectedFilter === "shipping" && query.subject === "shipping") ||
      (selectedFilter === "returns" && query.subject === "returns");

    return matchesSearch && matchesFilter;
  });

  // Get subject badge color
  const getSubjectColor = (subject) => {
    switch (subject) {
      case "order-issue": return "bg-red-100 text-red-800 border-red-200";
      case "product-info": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipping": return "bg-purple-100 text-purple-800 border-purple-200";
      case "returns": return "bg-orange-100 text-orange-800 border-orange-200";
      case "wholesale": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get subject display text
  const getSubjectText = (subject) => {
    switch (subject) {
      case "order-issue": return "Order Issue";
      case "product-info": return "Product Info";
      case "shipping": return "Shipping";
      case "returns": return "Returns";
      case "general": return "General";
      case "wholesale": return "Wholesale";
      default: return subject;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle query selection
  const toggleQuerySelection = (queryId) => {
    setSelectedQueries(prev =>
      prev.includes(queryId)
        ? prev.filter(id => id !== queryId)
        : [...prev, queryId]
    );
  };

  // Select all queries
  const selectAllQueries = () => {
    setSelectedQueries(filteredQueries.map(query => query._id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedQueries([]);
  };

  // Send email (placeholder function)
  const sendEmail = (query) => {
    alert(`Send email to: ${query.email}\nSubject: Re: ${getSubjectText(query.subject)}`);
    // Future implementation: Open email modal or redirect to email service
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Loading Customer Queries</h3>
          <p className="text-gray-600 text-sm sm:text-base">We&apos;re preparing your admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <span>Customer Queries</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {queries.length} total
                </span>
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Manage and respond to customer inquiries
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchQueries}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              {selectedQueries.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Clear ({selectedQueries.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Queries</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{queries.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Issues</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {queries.filter(q => q.subject === 'order-issue').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipping</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {queries.filter(q => q.subject === 'shipping').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Send className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Product Info</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {queries.filter(q => q.subject === 'product-info').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Queries</option>
                <option value="unread">Unread</option>
                <option value="order-issue">Order Issues</option>
                <option value="product-info">Product Info</option>
                <option value="shipping">Shipping</option>
                <option value="returns">Returns</option>
              </select>

              <button
                onClick={selectAllQueries}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Select All
              </button>
            </div>
          </div>
        </div>

        {/* Queries List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Subject</div>
            <div className="col-span-3">Message Preview</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Queries */}
          {filteredQueries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No matching queries' : 'No queries yet'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Customer queries will appear here when they contact you through the contact form.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredQueries.map((query) => (
                <div
                  key={query._id}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                    selectedQueries.includes(query._id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-4 lg:items-start">
                    {/* Checkbox */}
                    <div className="flex items-start mb-4 lg:mb-0 lg:col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedQueries.includes(query._id)}
                        onChange={() => toggleQuerySelection(query._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    {/* Customer Info */}
                    <div className="lg:col-span-3 mb-4 lg:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {query.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{query.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{query.email}</span>
                          </div>
                          {query.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{query.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="lg:col-span-2 mb-4 lg:mb-0">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getSubjectColor(query.subject)}`}>
                        {getSubjectText(query.subject)}
                      </span>
                    </div>

                    {/* Message Preview */}
                    <div className="lg:col-span-3 mb-4 lg:mb-0">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {query.message}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="lg:col-span-2 mb-4 lg:mb-0">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(query.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1 flex items-center justify-between lg:justify-end">
                      <button
                        onClick={() => sendEmail(query)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                        title="Send Email Response"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>

                      <button
                        onClick={() => setExpandedQuery(expandedQuery === query._id ? null : query._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs ml-2"
                      >
                        {expandedQuery === query._id ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedQuery === query._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 lg:col-span-12">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Full Message:</h5>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{query.message}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => sendEmail(query)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            <Send className="w-4 h-4" />
                            Send Email Response
                          </button>
                          
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Mark as Resolved
                          </button>
                          
                          <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {queries.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredQueries.length} of {queries.length} queries
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQueriesPage;