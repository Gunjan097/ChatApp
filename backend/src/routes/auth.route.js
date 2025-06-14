import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Create an Express router instance
const router = express.Router();


// Signup Route - Creates a new user account
router.post("/signup", signup);

// Login Route - Authenticates user and issues JWT token
router.post("/login", login);

// Logout Route - Clears the JWT token from cookies
router.post("/logout", logout);

// Protected Routes (Authentication Required)

// Update Profile Route - User must be authenticated
router.put("/update-profile", protectRoute, updateProfile);

// Check Authentication Route - Validates token and returns user info (if page refresh)
router.get("/check", protectRoute, checkAuth);

// Export the router to be used in main server file
export default router;
