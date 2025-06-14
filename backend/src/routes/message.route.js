// Import required modules
import express from "express";

// Import authentication middleware
import { protectRoute } from "../middleware/auth.middleware.js";

// Import message-related controllers
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

// Create a new router object
const router = express.Router();

// ✅ Route 1: Get all users except the logged-in user (for sidebar display)
router.get("/users", protectRoute, getUsersForSidebar);

// ✅ Route 2: Get all messages between logged-in user and a selected user
// Example endpoint: GET /api/messages/65a7abcxyz
router.get("/:id", protectRoute, getMessages);

// ✅ Route 3: Send a new message to a user
// Example endpoint: POST /api/messages/send/65a7abcxyz
router.post("/send/:id", protectRoute, sendMessage);

// ✅ Export the router to use in the main app
export default router;
