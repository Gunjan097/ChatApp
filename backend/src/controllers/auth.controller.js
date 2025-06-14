// Importing required utilities and models
import { generateToken } from "../lib/utils.js"; // For generating JWT tokens
import User from "../models/user.model.js"; // User model (MongoDB schema)
import bcrypt from "bcryptjs"; // For hashing passwords
import cloudinary from "../lib/cloudinary.js"; // For uploading profile pictures to Cloudinary

// ====================== Signup Controller ======================
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate input fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Encrypting the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token and save it in cookies
      generateToken(newUser._id, res);

      // Save the new user to the database
      await newUser.save();

      // Send success response with user details (excluding password)
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic, // Default profile picture (if any)
      });
    } else {
      // If user creation failed
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ====================== Login Controller ======================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }); //returns user object if a matching document is found.

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare entered password with hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token and save it in cookies
    generateToken(user._id, res);

    // Send success response with user details
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ====================== Logout Controller ======================
export const logout = (req, res) => {
  try {
    // Clear the JWT token cookie by setting it to an empty value
    res.cookie("jwt", "", { maxAge: 0 });

    // Send logout success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ====================== Update Profile Controller ======================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // New profile picture (base64 or file url)
    const userId = req.user._id; // User ID retrieved from JWT token

    // Validate input
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload profile picture to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Update user's profilePic URL in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true } // Return the updated document
    );

    // Send updated user data as response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ====================== Check Authentication Controller ======================
export const checkAuth = (req, res) => {
  try {
    // If middleware (like protect route) sets req.user, it means user is authenticated
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
