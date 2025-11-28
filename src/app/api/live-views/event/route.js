// app/api/live-views/event/route.js
import connectDB from "@/db/connectDB";
import Event from "@/model/Event";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('🎯 Event API received:', body);
    
    const { sessionId, type, payload = {}, utm = {}, fbclid = "" } = body;

    // Validate required fields
    if (!sessionId || !type) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "sessionId and type are required" 
      }), { status: 400 });
    }

    // Create event with timestamp
    const event = await Event.create({ 
      sessionId, 
      type, 
      payload, 
      utm, 
      fbclid,
      createdAt: new Date()
    });

    console.log('✅ Event created successfully:', event._id);

    return new Response(JSON.stringify({ 
      success: true,
      eventId: event._id 
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Event API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { status: 500 });
  }
}