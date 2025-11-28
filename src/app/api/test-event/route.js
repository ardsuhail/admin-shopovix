// app/api/test-event/route.js (Testing ke liye)
import connectDB from "@/db/connectDB";
import Event from "@/model/Event";

export async function POST(req) {
  try {
    await connectDB();
    
    // Test event create karo
    const testEvent = await Event.create({
      sessionId: 'test-session-' + Date.now(),
      type: 'TestEvent',
      payload: { 
        test: true, 
        timestamp: new Date(),
        product: 'Test Product',
        price: 999
      },
      utm: { 
        utm_source: 'test',
        utm_medium: 'testing',
        utm_campaign: 'test_campaign'
      },
      fbclid: 'test_fbclid',
      createdAt: new Date()
    });

    console.log('✅ Test event created:', testEvent._id);

    return new Response(JSON.stringify({
      success: true,
      event: {
        id: testEvent._id,
        sessionId: testEvent.sessionId,
        type: testEvent.type,
        createdAt: testEvent.createdAt
      },
      message: 'Test event created successfully'
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Test event failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    
    const events = await Event.find().sort({ createdAt: -1 }).limit(5);
    
    return new Response(JSON.stringify({
      success: true,
      totalEvents: await Event.countDocuments(),
      recentEvents: events
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
}