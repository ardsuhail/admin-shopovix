// components/AnalyticsDashboard.jsx
"use client";
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, Eye, MousePointer, Clock, Calendar, Globe, 
  Smartphone, Monitor, Tablet, TrendingUp 
} from 'lucide-react';

const timeRanges = [
  { value: "1d", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "14d", label: "Last 2 Weeks" },
  { value: "21d", label: "Last 3 Weeks" },
  { value: "30d", label: "Last 1 Month" },
  { value: "60d", label: "Last 2 Months" },
  { value: "90d", label: "Last 3 Months" },
  { value: "180d", label: "Last 6 Months" },
  { value: "365d", label: "Last 1 Year" },
  { value: "730d", label: "Last 2 Years" },
  { value: "1095d", label: "Last 3 Years" },
  { value: "all", label: "All Time" }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("7d");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/live-views/analytics?range=${selectedRange}`);
      const data = await res.json();
      setStats(data);
      
      // Chart data format karo
      if (data.visits) {
        const formattedData = data.visits.map(item => ({
          date: item._id,
          visits: item.count,
          visitors: Math.floor(item.count * 0.8) // Estimated unique visitors
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Comprehensive view of your website performance</p>
        </div>
        
        <select 
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="mt-4 lg:mt-0 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full lg:w-auto"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Visits</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-800 mt-1">
                {stats.totalVisits?.toLocaleString() || 0}
              </p>
            </div>
            <Eye className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-blue-600 text-xs mt-2">Page views</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs sm:text-sm font-medium">Unique Visitors</p>
              <p className="text-xl sm:text-2xl font-bold text-green-800 mt-1">
                {stats.uniqueVisitors?.toLocaleString() || 0}
              </p>
            </div>
            <Users className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-green-600 text-xs mt-2">Distinct users</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-xs sm:text-sm font-medium">Avg. Session</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-800 mt-1">
                {stats.avgSessionDuration || '0:00'}
              </p>
            </div>
            <Clock className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-purple-600 text-xs mt-2">Duration</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-xs sm:text-sm font-medium">Bounce Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-800 mt-1">
                {stats.bounceRate || '0%'}
              </p>
            </div>
            <TrendingUp className="text-orange-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-orange-600 text-xs mt-2">Single page visits</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Visits Over Time */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Visits Over Time</h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visits" stroke="#0088FE" strokeWidth={2} />
                <Line type="monotone" dataKey="visitors" stroke="#00C49F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Traffic Sources</h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.trafficSources || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.trafficSources?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Pages */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Top Pages</h3>
          <div className="space-y-2 sm:space-y-3">
            {stats.topPages?.slice(0, 8).map((page, index) => (
              <div key={page._id} className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 flex-shrink-0">#{index + 1}</span>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    {page._id === '/' ? 'Homepage' : page._id}
                  </span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2">
                  {page.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Location Stats */}
        <div className="space-y-4 sm:space-y-6">
          {/* Devices */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Devices
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {stats.devices?.map((device, index) => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {device.type === 'Mobile' && <Smartphone className="w-4 h-4 text-gray-600" />}
                    {device.type === 'Desktop' && <Monitor className="w-4 h-4 text-gray-600" />}
                    {device.type === 'Tablet' && <Tablet className="w-4 h-4 text-gray-600" />}
                    <span className="text-xs sm:text-sm text-gray-700">{device.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-800">{device.count}</span>
                    <span className="text-xs text-gray-500">({device.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Top Countries</h3>
            <div className="space-y-2">
              {stats.topCountries?.slice(0, 5).map((country, index) => (
                <div key={country._id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-700 truncate flex-1">{country._id}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2">
                    {country.visitors}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-xl border border-blue-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-blue-800">{stats.peakHour || 'N/A'}</p>
            <p className="text-xs sm:text-sm text-blue-600">Peak Traffic Hour</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-green-800">{stats.newVsReturning?.new || 0}%</p>
            <p className="text-xs sm:text-sm text-green-600">New Visitors</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-purple-800">{stats.conversionRate || '0%'}</p>
            <p className="text-xs sm:text-sm text-purple-600">Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}