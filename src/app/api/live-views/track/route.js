// app/api/track/route.js
import connectDB from "@/db/connectDB";
import Session from "@/model/Session";
import Visit from "@/model/Visit";

// IP Geolocation function
async function getLocationFromIP(ip) {
  // Localhost ke liye dummy data
  if (ip === '::1' || ip === '127.0.0.1' || !ip) {
    return {
      country: 'India',
      city: 'Mumbai',
      region: 'Maharashtra',
      timezone: 'Asia/Kolkata'
    };
  }

  try {
    // Free IP geolocation API use karte hain
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName,timezone`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        timezone: data.timezone
      };
    }
  } catch (error) {
    console.log('IP geolocation failed:', error);
  }

  return {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    timezone: 'Unknown'
  };
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const {
    sessionId,
    url,
    title,
    referrer,
    utm = {},
    fbclid = "",
    ip = "",
    ua = ""
  } = body;

  const now = new Date();

  // IP se location get karo
  const location = await getLocationFromIP(ip);

  // Upsert session with location data
  await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: { createdAt: now },
      $set: {
        ip,
        ua,
        referrer,
        url,
        country: location.country,
        city: location.city,
        region: location.region,
        timezone: location.timezone,
        utm: utm,
        "utm.fbclid": fbclid,
        lastSeen: now
      }
    },
    { upsert: true, new: true }
  );

  // Save visit with location
  await Visit.create({
    sessionId, 
    url, 
    title, 
    referrer, 
    ip, 
    ua, 
    country: location.country,
    city: location.city,
    region: location.region,
    utm, 
    fbclid, 
    createdAt: now
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}