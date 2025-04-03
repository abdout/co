import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  console.log('=== MongoDB Connection Debug ===');
  console.log('MONGODB_URI exists:', !!MONGODB_URI);
  console.log('Current connection state:', global.mongoose.conn ? 'Connected' : 'Not connected');
  
  if (global.mongoose.conn) {
    console.log('Using cached connection');
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new connection promise');
    global.mongoose.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
      throw error;
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    console.log('Connection established successfully');
  } catch (e) {
    console.error('Failed to establish connection:', e);
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

export default connectDB;