import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS for frontend access
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Frontend URL
  },
});

// Map to store connected users: { userId: socketId }
const userSocketMap = {};

/**
 * Utility to get the socket ID of a specific user.
 * Useful when sending private messages.
 */
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Listen for socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Extract userId from the socket handshake query
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Map the userId to the connected socket ID
    userSocketMap[userId] = socket.id;
  }

  // Send the updated list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection event
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove the user from the map (they are now offline)
    if (userId) {
      delete userSocketMap[userId];
    }

    // Broadcast the updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
