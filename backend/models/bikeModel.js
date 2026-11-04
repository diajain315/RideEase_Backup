import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    name: { 
      
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    startType: {
      type: String,
    },
    year: {
      type: Number,
    },
    kilometers: {
      type: Number,
    },
    petrolCapacity: {
      type: Number,
    },
  },
  
  { timestamps: true }
);
export default mongoose.model("Bikes", bikeSchema);

// const bikeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     number: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     category: {
//       type: mongoose.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     shipping: {
//       type: Boolean,
//     },
//     photo: {
//       data: Buffer,
//       contentType: String,
//     },
//     startType: {
//       type: String,
//     },
//     year: {
//       type: Number,
//     },
//     distance: {
//       type: Number,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Bike", bikeSchema);
