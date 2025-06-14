import mongoose from "mongoose";

// Async function to connect to MongoDB
export const connectDB = async () => {
  try {
    // Attempt to connect using the MongoDB URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // If successful, log the host name of the connected database
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error
    console.log("MongoDB connection error:", error);
    // Optionally, you can terminate the process if DB connection fails
    process.exit(1);
  }
};
