"use client";
import { useEffect, useState } from "react";

export default function AdminLive() {
  const [live, setLive] = useState({ 
    count: 0, 
    byUrl: {}, 
    active: [],
    byCountry: {},
    byCity: {},
    byDevice: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/live-views/live");
        const data = await res.json();
        if (mounted) {
          setLive(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch live data:", err);
        if (mounted) setIsLoading(false);
      }
    };

    fetchLive();
    const iv = setInterval(fetchLive, 5000);
    
    return () => { 
      mounted = false; 
      clearInterval(iv); 
    };
  }, []);

  const getDeviceIcon = (ua) => {
    if (!ua) return "🖥️";
    const uaLower = ua.toLowerCase();
    if (uaLower.includes("mobile")) return "📱";
    if (uaLower.includes("tablet")) return "📱";
    if (uaLower.includes("android")) return "📱";
    if (uaLower.includes("iphone")) return "📱";
    if (uaLower.includes("ipad")) return "📱";
    return "🖥️";
  };

  const getCountryFlag = (country) => {
    if (!country || country === 'Unknown') return "🌐";
    const flagEmojis = {
      'india': '🇮🇳',
      'united states': '🇺🇸',
      'us': '🇺🇸',
      'united kingdom': '🇬🇧',
      'uk': '🇬🇧',
      'canada': '🇨🇦',
      'australia': '🇦🇺',
      'germany': '🇩🇪',
      'france': '🇫🇷',
      'japan': '🇯🇵',
      'china': '🇨🇳',
      'brazil': '🇧🇷',
      'russia': '🇷🇺',
      'singapore': '🇸🇬',
      'uae': '🇦🇪',
      'saudi arabia': '🇸🇦',
      'pakistan': '🇵🇰',
      'bangladesh': '🇧🇩',
      'sri lanka': '🇱🇰',
      'nepal': '🇳🇵',
    };
    return flagEmojis[country.toLowerCase()] || '🌐';
  };

  // Filter out unknown countries and cities
  const knownCountries = Object.entries(live.byCountry || {}).filter(([country]) => 
    country && country !== 'Unknown'
  );
  
  const knownCities = Object.entries(live.byCity || {}).filter(([city]) => 
    city && city !== 'Unknown'
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 lg:w-[75vw] w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 lg:w-[75vw] w-full">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Live Visitors Dashboard</h3>
          <p className="text-gray-500 text-sm mt-1">Real-time user activity monitoring</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
          <div className="text-sm text-gray-500">
            Updated just now
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-600 text-sm font-medium">Total Live Visitors</div>
          <div className="text-3xl font-bold text-blue-800 mt-2">{live.count}</div>
          <div className="text-blue-600 text-xs mt-1">Active in last 25 seconds</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-green-600 text-sm font-medium">Unique Pages</div>
          <div className="text-3xl font-bold text-green-800 mt-2">{Object.keys(live.byUrl || {}).length}</div>
          <div className="text-green-600 text-xs mt-1">Active pages</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-purple-600 text-sm font-medium">Countries</div>
          <div className="text-3xl font-bold text-purple-800 mt-2">{knownCountries.length}</div>
          <div className="text-purple-600 text-xs mt-1">Active locations</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="text-orange-600 text-sm font-medium">Cities</div>
          <div className="text-3xl font-bold text-orange-800 mt-2">{knownCities.length}</div>
          <div className="text-orange-600 text-xs mt-1">Active cities</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Pages Section */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Active Pages
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(live.byUrl || {}).length > 0 ? (
              Object.entries(live.byUrl || {})
                .sort(([,a], [,b]) => b - a)
                .map(([url, count]) => (
                  <div key={url} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-600 truncate" title={url}>
                        {url === "/" ? "Homepage" : url.length > 40 ? `${url.substring(0, 40)}...` : url}
                      </span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))
            ) : (
              <div className="text-center text-gray-500 py-4 text-sm">
                No active pages
              </div>
            )}
          </div>
        </div>

        {/* Geographical Data */}
        <div className="space-y-4">
          {/* Countries */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              🌍 Visitors by Country
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {knownCountries.length > 0 ? (
                knownCountries
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCountryFlag(country)}</span>
                        <span className="text-sm text-gray-700 font-medium capitalize">
                          {country.toLowerCase()}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  No country data available
                </div>
              )}
            </div>
          </div>

          {/* Cities */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              🏙️ Visitors by City
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {knownCities.length > 0 ? (
                knownCities
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📍</span>
                        <span className="text-sm text-gray-700 font-medium">
                          {city}
                        </span>
                      </div>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  No city data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Devices Section - Ab alag row me */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          📱 Device Types
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(live.byDevice || {}).length > 0 ? (
            Object.entries(live.byDevice || {})
              .sort(([,a], [,b]) => b - a)
              .map(([device, count]) => (
                <div key={device} className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{getDeviceIcon(device)}</div>
                  <div className="text-sm text-gray-600 font-medium">{device}</div>
                  <div className="text-xl font-bold text-gray-800 mt-1">{count}</div>
                  <div className="text-xs text-gray-500 mt-1">visitors</div>
                </div>
              ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-4 text-sm">
              No device data available
            </div>
          )}
        </div>
      </div>

      {/* Real-time Active Users List */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Real-time Active Sessions ({live.active?.length || 0})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {live.active?.slice(0, 9).map((session, index) => (
            <div key={session.sessionId || index} className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getDeviceIcon(session.ua)}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {session.ip || 'IP Hidden'}
                  </span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="truncate font-medium" title={session.url}>
                  📍 {session.url === "/" ? "Homepage" : session.url || '/'}
                </div>
                
                {/* Country and City Display */}
                <div className="flex items-center space-x-1">
                  <span>{getCountryFlag(session.country)}</span>
                  <span className="font-medium">
                    {session.city && session.city !== 'Unknown' 
                      ? `${session.city}, ${session.country}`
                      : (session.country && session.country !== 'Unknown' ? session.country : 'Location Unknown')
                    }
                  </span>
                </div>

                {/* Additional Info */}
                <div className="flex justify-between text-gray-400">
                  <span>Last: {new Date(session.lastSeen).toLocaleTimeString()}</span>
                  <span>{new Date(session.lastSeen).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(!live.active || live.active.length === 0) && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No active sessions
          </div>
        )}
      </div>

      {/* Debug Info - Temporary (remove in production) */}
      <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
        <details className="text-xs">
          <summary className="cursor-pointer font-medium">Debug Info (Click to expand)</summary>
          <div className="mt-2 space-y-1">
            <div>Total Sessions: {live.active?.length || 0}</div>
            <div>Countries Data: {JSON.stringify(live.byCountry)}</div>
            <div>Cities Data: {JSON.stringify(live.byCity)}</div>
            <div>Sample Session: {JSON.stringify(live.active?.[0])}</div>
          </div>
        </details>
      </div>
    </div>
  );
}