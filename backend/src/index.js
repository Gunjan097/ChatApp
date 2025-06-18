import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Middleware to parse cookies from incoming requests
import cors from "cors"; // Middleware to handle Cross-Origin Resource Sharing

import path from "path"; // Node.js module to work with file and directory paths

import { connectDB } from "./lib/db.js"; // MongoDB connection setup

import authRoutes from "./routes/auth.route.js"; // Authentication routes
import messageRoutes from "./routes/message.route.js"; // Messaging routes
import { app, server } from "./lib/socket.js"; // App and socket server setup

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT; // Get port from environment variables
const __dirname = path.resolve(); // Get absolute path of the current directory

// Middlewares
app.use(express.json()); // Parse JSON data from request body
app.use(cookieParser()); // Parse cookies from request headers

// Enable CORS to allow requests from the frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this frontend origin
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Route handlers
app.use("/api/auth", authRoutes); // Mount authentication routes at /api/auth
app.use("/api/messages", messageRoutes); // Mount message routes at /api/messages

// Serve frontend in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from dist folder

  // For any route not found on the backend, return the frontend index.html (supports client-side routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the socket.io server and connect to MongoDB
server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB(); // Establish MongoDB connection
});
