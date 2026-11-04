// // routes/paymentRoutes.js
// import express from "express";
// import Razorpay from "razorpay";
// //import env from env;
// import dotenv from "dotenv";
// dotenv.config();


// const router = express.Router();
// const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
// const razorpay = new Razorpay({
//   key_id: RAZORPAY_ID_KEY,
//   key_secret: RAZORPAY_SECRET_KEY
// });

// // Create Order
// router.post("/createOrder", async (req, res) => {
//   try {
//     const { amount, name, email, contact, description } = req.body;

//     const order = await razorpay.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       notes: { name, email, contact, description }
//     });

//     res.json({
//       success: true,
//       key_id: process.env.RAZORPAY_KEY_ID,
//       order_id: order.id,
//       amount: order.amount,
//       name,
//       email,
//       contact,
//       msg: description
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, msg: "Error creating Razorpay order" });
//   }
// });

// // Update Payment
// router.post("/updatePayment", async (req, res) => {
//   const { email, amount } = req.body;
//   console.log(`Payment of ₹${amount} received for ${email}`);
//   res.json({ success: true, msg: "Payment recorded successfully" });
// });

// export default router;
import express from "express";
import { getKey, processPayment } from "../controllers/paymentController.js";
const router = express.Router();
router.route("/payment/process").post(processPayment);
router.route("/getKey").get(getKey)
export default router;
