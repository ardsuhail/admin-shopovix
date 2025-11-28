// import connectDB from "@/db/connectDB";
// import Session from "@/model/Session";

// export async function GET(req) {
//   await connectDB();
//   const now = new Date();
//   const threshold = new Date(now.getTime() - 25 * 1000); // active last 25s
//   const active = await Session.find({ lastSeen: { $gte: threshold } }).lean();

//   // optional aggregation: group by url
//   const byUrl = active.reduce((acc, s) => {
//     acc[s.url || "/"] = (acc[s.url || "/"] || 0) + 1;
//     return acc;
//   }, {});

//   return new Response(JSON.stringify({
//     count: active.length,
//     active,
//     byUrl
//   }), { status: 200 });
// }


// app/api/live-views/live/route.js
import connectDB from "@/db/connectDB";
import Session from "@/model/Session";

export async function GET(req) {
  await connectDB();
  const now = new Date();
  const threshold = new Date(now.getTime() - 25 * 1000);
  
  const active = await Session.find({ lastSeen: { $gte: threshold } }).lean();

  // Group by URL
  const byUrl = active.reduce((acc, s) => {
    acc[s.url || "/"] = (acc[s.url || "/"] || 0) + 1;
    return acc;
  }, {});

  // Group by Country (you'll need to add country detection logic)
  const byCountry = active.reduce((acc, s) => {
    const country = s.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Group by City
  const byCity = active.reduce((acc, s) => {
    const city = s.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Group by Device Type
  const byDevice = active.reduce((acc, s) => {
    const ua = s.ua || '';
    let device = 'Desktop';
    if (ua.toLowerCase().includes('mobile')) device = 'Mobile';
    if (ua.toLowerCase().includes('tablet')) device = 'Tablet';
    if (ua.toLowerCase().includes('android')) device = 'Mobile';
    if (ua.toLowerCase().includes('iphone')) device = 'Mobile';
    
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  return new Response(JSON.stringify({
    count: active.length,
    active,
    byUrl,
    byCountry,
    byCity,
    byDevice
  }), { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}