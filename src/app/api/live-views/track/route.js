// // app/api/track/route.js
// import connectDB from "@/db/connectDB";
// import Session from "@/model/Session";
// import Visit from "@/model/Visit";

// // IP Geolocation function
// async function getLocationFromIP(ip) {
//   // Localhost ke liye dummy data
//   if (ip === '::1' || ip === '127.0.0.1' || !ip) {
//     return {
//       country: 'India',
//       city: 'Mumbai',
//       region: 'Maharashtra',
//       timezone: 'Asia/Kolkata'
//     };
//   }

//   try {
//     // Free IP geolocation API use karte hain
//     const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName,timezone`);
//     const data = await response.json();
    
//     if (data.status === 'success') {
//       return {
//         country: data.country,
//         city: data.city,
//         region: data.regionName,
//         timezone: data.timezone
//       };
//     }
//   } catch (error) {
//     console.log('IP geolocation failed:', error);
//   }

//   return {
//     country: 'Unknown',
//     city: 'Unknown',
//     region: 'Unknown',
//     timezone: 'Unknown'
//   };
// }

// export async function POST(req) {
//   await connectDB();
//   const body = await req.json();
//   const {
//     sessionId,
//     url,
//     title,
//     referrer,
//     utm = {},
//     fbclid = "",
//     ip = "",
//     ua = ""
//   } = body;

//   const now = new Date();

//   // IP se location get karo
//   const location = await getLocationFromIP(ip);

//   // Upsert session with location data
//   await Session.findOneAndUpdate(
//     { sessionId },
//     {
//       $setOnInsert: { createdAt: now },
//       $set: {
//         ip,
//         ua,
//         referrer,
//         url,
//         country: location.country,
//         city: location.city,
//         region: location.region,
//         timezone: location.timezone,
//         utm: utm,
//         "utm.fbclid": fbclid,
//         lastSeen: now
//       }
//     },
//     { upsert: true, new: true }
//   );

//   // Save visit with location
//   await Visit.create({
//     sessionId, 
//     url, 
//     title, 
//     referrer, 
//     ip, 
//     ua, 
//     country: location.country,
//     city: location.city,
//     region: location.region,
//     utm, 
//     fbclid, 
//     createdAt: now
//   });

//   return new Response(JSON.stringify({ success: true }), { status: 200 });
// }



// app/api/live-views/track/route.js
import connectDB from "@/db/connectDB";
import Session from "@/model/Session";
import Visit from "@/model/Visit";

// Server-side IP detection
function getClientIP(req) {
  const vercelIP = req.headers.get('x-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return '127.0.0.1';
}

// Better Geolocation with multiple fallbacks
async function getLocationFromIP(ip) {
  console.log('📍 Getting location for IP:', ip);
  
  // Localhost ke liye demo data
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
    return {
      country: 'India',
      city: 'Mumbai',
      region: 'Maharashtra',
      timezone: 'Asia/Kolkata'
    };
  }

  // Try multiple geolocation services
  const services = [
    {
      name: 'ipapi.co',
      url: `https://ipapi.co/${ip}/json/`,
      parser: (data) => ({
        country: data.country_name,
        city: data.city,
        region: data.region,
        timezone: data.timezone
      }),
      check: (data) => data.country_name && data.country_name !== 'Undefined'
    },
    {
      name: 'ip-api.com',
      url: `https://ip-api.com/json/${ip}?fields=status,message,country,city,regionName,timezone`,
      parser: (data) => ({
        country: data.country,
        city: data.city,
        region: data.regionName,
        timezone: data.timezone
      }),
      check: (data) => data.status === 'success'
    },
    {
      name: 'ipwhois',
      url: `https://ipwho.is/${ip}`,
      parser: (data) => ({
        country: data.country,
        city: data.city,
        region: data.region,
        timezone: data.timezone?.id || data.timezone
      }),
      check: (data) => data.success === true
    },
    {
      name: 'ipapi (commercial)',
      url: `https://ipapi.com/ip_api.php?ip=${ip}`,
      parser: (data) => ({
        country: data.country_name,
        city: data.city,
        region: data.region_name,
        timezone: data.time_zone?.id
      }),
      check: (data) => data.country_name
    }
  ];

  for (const service of services) {
    try {
      console.log(`🌐 Trying ${service.name}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(service.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`📡 ${service.name} Response:`, data);
        
        if (service.check(data)) {
          const location = service.parser(data);
          console.log(`✅ ${service.name} success:`, location);
          return location;
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`⏰ ${service.name} timeout`);
      } else {
        console.log(`❌ ${service.name} failed:`, error.message);
      }
      continue;
    }
  }

  // Final fallback: Free API with no key required
  try {
    console.log('🌐 Trying freegeoip.app...');
    const response = await fetch(`https://freegeoip.app/json/${ip}`);
    if (response.ok) {
      const data = await response.json();
      console.log('📡 freegeoip Response:', data);
      
      if (data.country_name) {
        return {
          country: data.country_name,
          city: data.city,
          region: data.region_name,
          timezone: data.time_zone
        };
      }
    }
  } catch (error) {
    console.log('❌ freegeoip failed:', error.message);
  }

  console.log('⚠️ All geolocation services failed');
  return {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    timezone: 'Unknown'
  };
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('📝 Track API Body received:', body);
    
    const {
      sessionId,
      url,
      title,
      referrer,
      utm = {},
      fbclid = "",
      ip: clientIPFromBody = "",
      ua = ""
    } = body;

    // Server-side IP detection (more reliable)
    const serverDetectedIP = getClientIP(req);
    const finalIP = clientIPFromBody || serverDetectedIP;
    
    console.log('🖥️ Final IP being used:', finalIP);

    const now = new Date();

    // IP se location get karo
    const location = await getLocationFromIP(finalIP);
    console.log('📍 Final Location data:', location);

    // Session data
    const sessionData = {
      ip: finalIP,
      ua: ua || 'Unknown',
      referrer: referrer || '',
      url: url || '/',
      country: location.country,
      city: location.city,
      region: location.region, 
      timezone: location.timezone,
      utm: {
        utm_source: utm.utm_source || '',
        utm_medium: utm.utm_medium || '',
        utm_campaign: utm.utm_campaign || '',
        fbclid: fbclid || ''
      },
      lastSeen: now
    };

    console.log('💾 Saving session data with location:', {
      country: sessionData.country,
      city: sessionData.city
    });

    // Upsert session
    const session = await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: sessionData,
        $setOnInsert: { 
          createdAt: now,
          sessionId: sessionId 
        }
      },
      { 
        upsert: true, 
        new: true
      }
    );

    console.log('✅ Session saved with location:', {
      country: session.country,
      city: session.city
    });

    // Save visit
    const visitData = {
      sessionId, 
      url: url || '/', 
      title: title || '', 
      referrer: referrer || '', 
      ip: finalIP,
      ua: ua || 'Unknown',
      country: location.country,
      city: location.city,
      region: location.region,
      utm: utm, 
      fbclid: fbclid, 
      createdAt: now
    };

    const visit = await Visit.create(visitData);
    console.log('✅ Visit saved with ID:', visit._id);

    return new Response(JSON.stringify({ 
      success: true,
      location: location,
      ipUsed: finalIP,
      sessionId: sessionId
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Track API Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), { status: 500 });
  }
}