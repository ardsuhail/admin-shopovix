"use client";
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  MessageSquare,
  Mail,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardClient = ({ initialData }) => {
  const [data, setData] = useState({
    orders: [],
    customers: [],
    subscribers: [],
    reviews: [],
    queries: []
  });
  
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  // Initialize data with initialData
  useEffect(() => {
    if (initialData) {
      setData({
        orders: initialData.orders || [],
        customers: initialData.customers || [],
        subscribers: initialData.subscribers || [],
        reviews: initialData.reviews || [],
        queries: initialData.queries || []
      });
    }
  }, [initialData]);

  // Refresh data function
  const refreshData = async () => {
    setLoading(true);
    try {
      console.log('Refreshing dashboard data...');
      
      const [ordersRes, customersRes, subscribersRes, reviewsRes, queriesRes] = await Promise.all([
        fetch('/api/allorders').then(res => res.json()),
        fetch('/api/customer-order').then(res => res.json()),
        fetch('/api/subscriber').then(res => res.json()),
        fetch('/api/reviews').then(res => res.json()),
        fetch('/api/query').then(res => res.json())
      ]);

      setData({
        orders: ordersRes.allorders || ordersRes.orders || [],
        customers: customersRes.customer || customersRes.customers || [],
        subscribers: subscribersRes.subscribers || subscribersRes.subscriber || [],
        reviews: reviewsRes.reviews || reviewsRes.review || [],
        queries: queriesRes.queries || queriesRes.query || []
      });

      console.log('Data refreshed successfully');
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Safe date parsing function
  const safeParseDate = (dateString) => {
    if (!dateString) return new Date(0);
    try {
      return new Date(dateString);
    } catch {
      return new Date(0);
    }
  };

  // Calculate analytics with safe data handling
  const calculateAnalytics = () => {
    const { orders, customers, subscribers, reviews, queries } = data;
    
    console.log('Calculating analytics with:', { 
      orders: orders.length, 
      customers: customers.length,
      subscribers: subscribers.length,
      reviews: reviews.length,
      queries: queries.length
    });
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Today's metrics with safe date handling
    const todayOrders = orders.filter(order => {
      const orderDate = safeParseDate(order.createdAt || order.created_at);
      return orderDate >= todayStart;
    });
    
    const todaySales = todayOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    
    // Total metrics with safe number conversion
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    
    const pendingOrders = orders.filter(order => 
      (order.paymentStatus === 'pending' || order.orderStatus === 'processing') && 
      order.paymentStatus !== 'paid'
    ).length;
    
    const completedOrders = orders.filter(order => 
      order.paymentStatus === 'paid' || order.orderStatus === 'delivered'
    ).length;

    // Average order value with safe calculation
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Revenue trend (last 7 days) with safe date handling
    const revenueData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      
      const dayOrders = orders.filter(order => {
        const orderDate = safeParseDate(order.createdAt || order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const revenue = dayOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
      
      return {
        date: dateStr,
        revenue,
        orders: dayOrders.length
      };
    });

    return {
      totals: {
        orders: orders.length,
        todayOrders: todayOrders.length,
        todaySales,
        totalRevenue,
        pendingOrders,
        completedOrders,
        customers: customers.length,
        subscribers: subscribers.length,
        reviews: reviews.length,
        queries: queries.length,
        averageOrderValue
      },
      charts: {
        revenueData
      },
      latestOrders: orders
        .sort((a, b) => safeParseDate(b.createdAt || b.created_at) - safeParseDate(a.createdAt || a.created_at))
        .slice(0, 5)
    };
  };

  const analytics = calculateAnalytics();

  // Stats Cards
  const StatCard = ({ title, value, icon: Icon, change, color, prefix, suffix }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {change > 0 ? <ArrowUp className="w-4 h-4" /> : change < 0 ? <ArrowDown className="w-4 h-4" /> : null}
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <RefreshCw className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Refreshing Data</h3>
          <p className="text-gray-600">Please wait...</p>
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
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <span>Dashboard Overview</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time analytics and business insights
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Revenue"
            value={analytics.totals.totalRevenue}
            icon={DollarSign}
            color="text-green-600"
            prefix="₹"
          />
          <StatCard
            title="Today's Sales"
            value={analytics.totals.todaySales}
            icon={ShoppingCart}
            color="text-blue-600"
            prefix="₹"
          />
          <StatCard
            title="Total Orders"
            value={analytics.totals.orders}
            icon={Package}
            color="text-purple-600"
          />
          <StatCard
            title="Today's Orders"
            value={analytics.totals.todayOrders}
            icon={TrendingUp}
            color="text-orange-600"
          />
        </div>

        {/* Second Row Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Pending Orders"
            value={analytics.totals.pendingOrders}
            icon={Clock}
            color="text-yellow-600"
          />
          <StatCard
            title="Completed Orders"
            value={analytics.totals.completedOrders}
            icon={CheckCircle}
            color="text-green-600"
          />
          <StatCard
            title="Total Customers"
            value={analytics.totals.customers}
            icon={Users}
            color="text-indigo-600"
          />
          <StatCard
            title="Customer Queries"
            value={analytics.totals.queries}
            icon={MessageSquare}
            color="text-red-600"
          />
        </div>

        {/* Third Row Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Subscribers"
            value={analytics.totals.subscribers}
            icon={Mail}
            color="text-pink-600"
          />
          <StatCard
            title="Product Reviews"
            value={analytics.totals.reviews}
            icon={Star}
            color="text-amber-600"
          />
          <StatCard
            title="Avg Order Value"
            value={Math.round(analytics.totals.averageOrderValue)}
            icon={DollarSign}
            color="text-emerald-600"
            prefix="₹"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.charts.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1D4ED8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend (Last 7 Days)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.charts.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="orders" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Latest Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Latest Orders</h3>
              <span className="text-sm text-gray-500">{analytics.latestOrders.length} orders</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.latestOrders.map((order, index) => (
                  <tr key={order._id || order.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId || order._id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName || order.fullName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.orderStatus === 'delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {analytics.latestOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;