
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

// Importing routing tools
import { Routes, Route, Navigate } from "react-router-dom";

// Importing custom auth and theme stores (probably Zustand or similar)
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

// Other dependencies
import { useEffect } from "react";
import { Loader } from "lucide-react"; // Loading spinner icon
import { Toaster } from "react-hot-toast"; // For toast notifications

const App = () => {
  // Destructure auth and theme states from custom stores
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers }); // For debugging connected users

  // On initial render, check if the user is authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser }); // Debugging current authenticated user

  // Show loading screen while checking authentication
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    // Apply selected theme to the entire app
    <div data-theme={theme}>
      <Navbar />

      {/* Define all routes */}
      <Routes>
        {/* If user is authenticated, show HomePage, else redirect to login */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        {/* Signup route is only accessible when the user is not authenticated */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Login route is only accessible when the user is not authenticated */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        {/* Settings page is open, not protected */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Profile page is protected, redirects to login if not authenticated */}
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      {/* Global notification toaster */}
      <Toaster />
    </div>
  );
};

export default App;
