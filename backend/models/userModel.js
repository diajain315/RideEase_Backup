import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    otp: {
      code: { type: String },
      expiry: { type: Date },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      default: "",
    },
    gender: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      enum: ["male", "female", "other"],
      default: "other",
    },
    googleId: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: Number,
      default: 0, // 0: User, 1: Admin
    },
    licenseNumber: {
      type: String,
      required: false, // Optional field, can be added later
    },
    licenseFile: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
