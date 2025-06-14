// Import mongoose for schema and model creation
import mongoose from "mongoose";

// Define the message schema
const messageSchema = new mongoose.Schema(
  {
    // Reference to the sender (User model)
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
      ref: "User", // Referencing the User collection
      required: true, // Sender is mandatory
    },

    // Reference to the receiver (User model)
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
      ref: "User", // Referencing the User collection
      required: true, // Receiver is mandatory
    },

    // Text content of the message
    text: {
      type: String, // Optional text message
    },

    // Image URL if the message contains an image
    image: {
      type: String, // Optional image message
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;
