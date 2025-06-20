import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"; // Zustand store for auth-related data and actions
import { Camera, Mail, User } from "lucide-react"; // Icons

const ProfilePage = () => {
  // Get user info and functions from the auth store
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  
  // State to store the newly selected image (for preview)
  const [selectedImg, setSelectedImg] = useState(null);

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return;

    const reader = new FileReader(); // Create a FileReader to read the file as base64

    reader.readAsDataURL(file); // Read the file as base64 string

    reader.onload = async () => {
      const base64Image = reader.result; // Once reading is done, get the base64 string
      setSelectedImg(base64Image); // Show the image preview immediately
      await updateProfile({ profilePic: base64Image }); // Send the image to backend to update the profile
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Profile Image Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Profile Picture Preview */}
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"} // Show selected image or existing profile picture or default avatar
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              
              {/* Camera Icon Upload Button */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile} // Disable input while updating
                />
              </label>
            </div>
            
            {/* Upload Status */}
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Details Section */}
          <div className="space-y-6">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            
            <div className="space-y-3 text-sm">
              {/* Member Since */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span> {/* Showing only the date part */}
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span> {/* Static status for now */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;