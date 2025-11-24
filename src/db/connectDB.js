import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error('MONGODB_URI is not defined in environment variables')
    console.error(err.message)
    throw err
  }

  // Reuse existing connection if already connected (important in dev/hot-reload)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    // Use cached promise pattern to avoid multiple simultaneous connections
    if (!global._mongoosePromise) {
      global._mongoosePromise = mongoose.connect(uri, {
        // recommended options can be added here if needed
      }).then((m) => m.connection)
    }

    const conn = await global._mongoosePromise
    return conn
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error)
    throw error
  }
}

export default connectDB;