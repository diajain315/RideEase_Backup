// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     otp: {
//       code: { type: String },
//       expiry: { type: Date }
//     },
    
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
    
//     role: {
//       type: Number,
//       default: 0,
//     },
//     phone: {
//       type: String,
//       required: true,
//       match: /^[6-9]\d{9}$/, // Ensure it's a valid Indian phone number
//     },
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'other'],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// export default mongoose.model("Users", userSchema);

// import mongoose from "mongoose";


// const userSchema = new mongoose.Schema(
//   {
//     otp: {
//             code: { type: String },
//             expiry: { type: Date }
//           },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: Number,
//       default: 0, // 0: User, 1: Admin
//     },
    
    
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Users", userSchema); 43-75

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
      required: true,
    },
    phone: {
      type: String,
      required: true, 
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"], // Restrict to only these values
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
