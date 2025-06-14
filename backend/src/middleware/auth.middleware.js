// Import necessary modules
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes - Only accessible if the user is authenticated
export const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from the cookies
    const token = req.cookies.jwt;

    // If no token is present, block access
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is invalid, block access
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find the user associated with the token but exclude the password field
    const user = await User.findById(decoded.userId).select("-password");

    // If the user does not exist, block access
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request for further access in other routes/controllers
    req.user = user;

    // Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};