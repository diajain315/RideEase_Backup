// models/contactModel.js
import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  adminReply: { type: String, default: "" },
  repliedAt: { type: Date },
  status: { type: String, enum: ["pending", "replied"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", ContactMessageSchema);
