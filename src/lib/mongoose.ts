import mongoose from 'mongoose';

// Track connection status
let isConnected = false;

/**
 * Connect to MongoDB
 */
export const connectToDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  // If not connected, check for environment variable
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found in environment variables');
    throw new Error('MONGODB_URI not found in environment variables');
  }

  try {
    // Set strictQuery to prepare for Mongoose 7
    mongoose.set('strictQuery', true);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectFromDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}; 