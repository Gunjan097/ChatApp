import User from "../models/user.model.js";
import Message from "../models/message.model.js";
// Import Cloudinary for image uploads and socket utilities
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//  Get All Users for Sidebar (Excluding Logged-in User)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all users except the logged-in user, exclude password field
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get Chat Messages Between Two Users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // User you are chatting with
    const myId = req.user._id; // Logged-in user's ID

    /*
      Now we need to find messages between these two users.
      This can happen in two ways:
      1. I sent a message to userToChatId.
      2. userToChatId sent a message to me.

      So we use MongoDB's $or operator to find both cases.
    */
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },   // messages I sent
        { senderId: userToChatId, receiverId: myId },   // messages I received
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Send a Message (Text or Image)
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Message data
    const { id: receiverId } = req.params; // Receiver user ID from URL
    const senderId = req.user._id; // Logged-in user's ID

    let imageUrl;
    if (image) {
      // If an image is present, upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Get the socket ID of the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    // If receiver is online, send the message via socket
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
