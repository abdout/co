'use server';

import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function testMongoConnection() {
  console.log("Server Action: Testing MongoDB connection");
  
  try {
    // Try to connect to MongoDB
    console.log("Server Action: Calling connectDB()");
    await connectDB();
    
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    console.log(`Server Action: MongoDB connection state: ${connectionStates[connectionState as keyof typeof connectionStates]}`);
    
    // Return connection status
    return {
      success: connectionState === 1,
      state: connectionStates[connectionState as keyof typeof connectionStates],
      message: connectionState === 1 
        ? "Successfully connected to MongoDB" 
        : `Connection issue: State is ${connectionStates[connectionState as keyof typeof connectionStates]}`
    };
  } catch (error) {
    console.error("Server Action: MongoDB connection error:", error);
    
    // If this is a MongoDB-specific error, provide specific feedback
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        return {
          success: false,
          message: "Could not find the MongoDB server - check your connection string hostname",
          error: error.message
        };
      } else if (error.message.includes('ETIMEDOUT')) {
        return {
          success: false,
          message: "Connection timed out - check your network or firewall settings",
          error: error.message
        };
      } else if (error.message.includes('Authentication failed')) {
        return {
          success: false,
          message: "Authentication failed - check your username and password",
          error: error.message
        };
      } else if (error.message.includes('not authorized') || error.message.includes('not authorised')) {
        return {
          success: false,
          message: "Not authorized to access the database - check your user permissions",
          error: error.message
        };
      } else if (error.message.includes('IP address is not whitelisted')) {
        return {
          success: false,
          message: "Your IP address is not whitelisted in MongoDB Atlas",
          error: error.message
        };
      }
    }
    
    // Generic error response
    return {
      success: false,
      message: "Failed to connect to MongoDB",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function getMongodbInfo() {
  const uri = process.env.MONGODB_URI || '';
  
  if (!uri) {
    return {
      success: false,
      message: "MONGODB_URI environment variable is not defined",
      uriDefined: false
    };
  }
  
  // Parse the URI to extract information without exposing credentials
  try {
    const regex = /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(\?.*)?/;
    const match = uri.match(regex);
    
    if (!match) {
      return {
        success: false,
        message: "Invalid MongoDB URI format",
        uriDefined: true,
        format: "invalid"
      };
    }
    
    const [, isSrv, username, , host, database, queryParams] = match;
    
    return {
      success: true,
      uriDefined: true,
      format: "valid",
      info: {
        protocol: isSrv ? "mongodb+srv" : "mongodb",
        username,
        host,
        database,
        hasQueryParams: !!queryParams
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Could not parse MongoDB URI",
      uriDefined: true,
      format: "unparseable",
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 