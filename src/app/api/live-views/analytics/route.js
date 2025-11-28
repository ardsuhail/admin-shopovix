// app/api/analytics/route.js
import connectDB from "@/db/connectDB";
import Visit from "@/model/Visit";
import Session from "@/model/Session";
import Event from "@/model/Event";

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "7d";
  
  const now = new Date();
  let startDate;

  // Date range calculation
  if (range === "1d") {
    startDate = new Date(now.getTime() - 24 * 3600 * 1000);
  } else if (range === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  } else if (range === "14d") {
    startDate = new Date(now.getTime() - 14 * 24 * 3600 * 1000);
  } else if (range === "21d") {
    startDate = new Date(now.getTime() - 21 * 24 * 3600 * 1000);
  } else if (range === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  } else if (range === "60d") {
    startDate = new Date(now.getTime() - 60 * 24 * 3600 * 1000);
  } else if (range === "90d") {
    startDate = new Date(now.getTime() - 90 * 24 * 3600 * 1000);
  } else if (range === "180d") {
    startDate = new Date(now.getTime() - 180 * 24 * 3600 * 1000);
  } else if (range === "365d") {
    startDate = new Date(now.getTime() - 365 * 24 * 3600 * 1000);
  } else if (range === "730d") {
    startDate = new Date(now.getTime() - 730 * 24 * 3600 * 1000);
  } else if (range === "1095d") {
    startDate = new Date(now.getTime() - 1095 * 24 * 3600 * 1000);
  } else {
    // All time
    startDate = new Date(0);
  }

  try {
    // 1. Total Visits (Real)
    const totalVisits = await Visit.countDocuments({ createdAt: { $gte: startDate } });

    // 2. Unique Visitors (Real)
    const uniqueVisitors = await Visit.distinct("sessionId", { createdAt: { $gte: startDate } });

    // 3. Visits per day for chart (Real)
    const visits = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4. Top Pages (Real)
    const topPages = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$url",
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // 5. Traffic Sources (Real)
const trafficSources = await Visit.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: {
        $cond: [
          // Direct Traffic
          { $or: [
            { $eq: ["$referrer", ""] },
            { $eq: ["$referrer", null] },
            { $eq: ["$referrer", "null"] }
          ]},
          "Direct",
          {
            $cond: [
              // Google Organic
              { $regexMatch: { input: "$referrer", regex: /google\./ } },
              "Google Organic",
              {
                $cond: [
                  // Facebook
                  { $regexMatch: { input: "$referrer", regex: /facebook\.|fb\./ } },
                  "Facebook",
                  {
                    $cond: [
                      // Instagram
                      { $regexMatch: { input: "$referrer", regex: /instagram\./ } },
                      "Instagram",
                      {
                        $cond: [
                          // YouTube
                          { $regexMatch: { input: "$referrer", regex: /youtube\./ } },
                          "YouTube",
                          {
                            $cond: [
                              // Other Search Engines (Organic)
                              { $regexMatch: { input: "$referrer", regex: /bing\.|yahoo\.|duckduckgo\./ } },
                              "Other Organic",
                              // Social Media & Other Referrals
                              "Other Referrals"
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      value: { $sum: 1 }
    }
  },
  { $sort: { value: -1 } }
]);

    // 6. Device Types (Real)
    const devices = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $regexMatch: { input: "$ua", regex: /mobile/i } }, then: "Mobile" },
                { case: { $regexMatch: { input: "$ua", regex: /tablet/i } }, then: "Tablet" }
              ],
              default: "Desktop"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate percentages for devices
    const totalDevices = devices.reduce((sum, device) => sum + device.count, 0);
    const devicesWithPercentage = devices.map(device => ({
      type: device._id,
      count: device.count,
      percentage: totalDevices > 0 ? Math.round((device.count / totalDevices) * 100) : 0
    }));

    // 7. Top Countries (Real)
    const topCountries = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate }, country: { $ne: "Unknown" } } },
      {
        $group: {
          _id: "$country",
          visitors: { $sum: 1 }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 10 }
    ]);

    // 8. REAL Session Duration (Fixed Calculation)
    const sessionDurations = await Session.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          lastSeen: { $exists: true, $ne: null }
        } 
      },
      {
        $project: {
          duration: { $subtract: ["$lastSeen", "$createdAt"] }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
          totalSessions: { $sum: 1 }
        }
      }
    ]);

    const avgSessionMs = sessionDurations[0]?.avgDuration || 0;
    let avgSessionDuration = "No data";
    
    if (avgSessionMs > 0) {
      const avgSessionMinutes = Math.floor(avgSessionMs / (1000 * 60));
      const avgSessionSeconds = Math.floor((avgSessionMs % (1000 * 60)) / 1000);
      
      if (avgSessionMinutes > 0) {
        avgSessionDuration = `${avgSessionMinutes}m ${avgSessionSeconds}s`;
      } else {
        avgSessionDuration = `${avgSessionSeconds}s`;
      }
    }

    // 9. REAL Bounce Rate (Fixed Calculation)
    const sessionPages = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$sessionId",
          pageCount: { $sum: 1 }
        }
      }
    ]);

    const totalSessions = sessionPages.length;
    const bouncedSessions = sessionPages.filter(session => session.pageCount === 1).length;
    const bounceRate = totalSessions > 0 
      ? Math.round((bouncedSessions / totalSessions) * 100) 
      : 0;

    // 10. REAL Peak Traffic Hour (Fixed)
    const hourlyTraffic = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          visits: { $sum: 1 }
        }
      },
      { $sort: { visits: -1 } },
      { $limit: 1 }
    ]);

    let peakHour = "No data";
    if (hourlyTraffic[0]) {
      const hour = hourlyTraffic[0]._id;
      peakHour = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour || 12} AM`;
    }

    // 11. REAL New vs Returning Visitors
    const visitorSessions = await Session.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$sessionId",
          firstSeen: { $min: "$createdAt" }
        }
      }
    ]);

    // Agar session current range ke start date se pehle bhi exist karti hai to wo returning visitor hai
    const returningVisitors = await Session.aggregate([
      {
        $match: {
          lastSeen: { $gte: startDate },
          createdAt: { $lt: startDate }
        }
      },
      {
        $group: {
          _id: "$sessionId"
        }
      }
    ]);

    const newVisitorsCount = visitorSessions.length - returningVisitors.length;
    const returningVisitorsCount = returningVisitors.length;

    const newVsReturning = {
      new: newVisitorsCount > 0 ? Math.round((newVisitorsCount / visitorSessions.length) * 100) : 0,
      returning: returningVisitorsCount > 0 ? Math.round((returningVisitorsCount / visitorSessions.length) * 100) : 0
    };

    // 12. REAL Conversion Rate (Only if events exist)
    let conversionRate = "No data";
    const conversionEvents = await Event.countDocuments({ 
      createdAt: { $gte: startDate },
      type: { $in: ["Purchase", "SignUp", "Contact", "Download", "FormSubmit"] }
    });

    if (conversionEvents > 0 && uniqueVisitors.length > 0) {
      const rate = (conversionEvents / uniqueVisitors.length) * 100;
      conversionRate = `${rate.toFixed(1)}%`;
    }

    return new Response(JSON.stringify({
      totalVisits,
      uniqueVisitors: uniqueVisitors.length,
      visits,
      topPages,
      trafficSources,
      devices: devicesWithPercentage,
      topCountries,
      avgSessionDuration,
      bounceRate: `${bounceRate}%`,
      peakHour,
      newVsReturning,
      conversionRate,
      // Additional real metrics
      totalSessions: totalSessions,
      bouncedSessions: bouncedSessions,
      multiPageSessions: totalSessions - bouncedSessions
    }), { status: 200 });

  } catch (error) {
    console.error("Analytics API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch analytics" }), { status: 500 });
  }
}