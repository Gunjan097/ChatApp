import { create } from "zustand"; // for global state management
import { axiosInstance } from "../lib/axios.js"; // Pre-configured axios instance for API calls
import toast from "react-hot-toast"; // For showing success/error pop-up notifications
import { io } from "socket.io-client"; // For real-time communication using WebSockets

// Set the base URL depending on development or production mode
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// Create a Zustand store
export const useAuthStore = create((set, get) => ({
  // States
  authUser: null, // Stores the authenticated user
  isSigningUp: false, // Tracks signup loading state
  isLoggingIn: false, // Tracks login loading state
  isUpdatingProfile: false, // Tracks profile update loading state
  isCheckingAuth: true, // Tracks auth check loading state
  onlineUsers: [], // Stores IDs of online users
  socket: null, // Stores the socket connection

  // Checks if user is logged in (runs on app load)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // API to check if user is authenticated
      set({ authUser: res.data }); // Save user in state
      get().connectSocket(); // Connect to socket after login check
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // If check fails, clear user
    } finally {
      set({ isCheckingAuth: false }); // Mark auth check complete
    }
  },

  // Handles user signup
  signup: async (data) => {
    set({ isSigningUp: true }); // Show loading state
    try {
      const res = await axiosInstance.post("/auth/signup", data); // Signup API call
      set({ authUser: res.data }); // Save user on success
      toast.success("Account created successfully"); // Success toast
      get().connectSocket(); // Connect socket after signup
    } catch (error) {
      toast.error(error.response.data.message); // Show backend error
    } finally {
      set({ isSigningUp: false }); // Hide loading state
    }
  },

  // Handles user login
  login: async (data) => {
    set({ isLoggingIn: true }); // Show loading state
    try {
      const res = await axiosInstance.post("/auth/login", data); // Login API call
      set({ authUser: res.data }); // Save user on success
      toast.success("Logged in successfully"); // Success toast
      get().connectSocket(); // Connect socket after login
    } catch (error) {
      toast.error(error.response.data.message); // Show backend error
    } finally {
      set({ isLoggingIn: false }); // Hide loading state
    }
  },

  // Handles user logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout"); // Logout API call
      set({ authUser: null }); // Clear user from state
      toast.success("Logged out successfully"); // Success toast
      get().disconnectSocket(); // Disconnect socket on logout
    } catch (error) {
      toast.error(error.response.data.message); // Show backend error
    }
  },

  // Updates user profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true }); // Show loading state
    try {
      const res = await axiosInstance.put("/auth/update-profile", data); // Update profile API call
      set({ authUser: res.data }); // Update user in state
      toast.success("Profile updated successfully"); // Success toast
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message); // Show backend error
    } finally {
      set({ isUpdatingProfile: false }); // Hide loading state
    }
  },

  // Connects to socket.io server
  connectSocket: () => {
    const { authUser } = get(); // Get current user
    if (!authUser || get().socket?.connected) return; // Do nothing if already connected or user not found

    // Initialize socket connection with user ID
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // Pass userId as query parameter
      },
    });

    socket.connect(); // Connect to server

    set({ socket: socket }); // Save socket to state

    // Listen for 'getOnlineUsers' event to update online users list
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Disconnects the socket connection
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect(); // Disconnect if connected
  },
}));
