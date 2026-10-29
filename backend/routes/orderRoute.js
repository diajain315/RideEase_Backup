import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  AllOrdersController,
  getOrdersController,
  makeOrderController,
  updateStatusController,
  razorpaySuccessController,
  getBikeBookedSlotsController,
} from "../controllers/orderController.js";
import BikeOrder from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const router = express.Router();

// 🔒 Get booked / locked date slots for a specific vehicle (public/user)
router.get("/bike-booked-slots/:bikeId", getBikeBookedSlotsController);

// 📦 Place Order
router.post("/make-order", requireSignIn, makeOrderController);

// 📄 Get user-specific orders
router.get("/orders", requireSignIn, getOrdersController);

// 📊 Get all orders (admin)
router.get("/allorders", requireSignIn, isAdmin, AllOrdersController);

// ✅ Admin manually updates order status
router.put("/order-status/:orderId", requireSignIn, isAdmin, updateStatusController);

// Razorpay payment success route
router.post("/razorpay-success", razorpaySuccessController);

// 🧾 Razorpay: User update after successful payment
router.put("/update-status/:orderId", requireSignIn, async (req, res) => {
  const { status, paymentId } = req.body;

  try {
    const user = await userModel.findById(req.user._id);
    if (!user || !user.licenseNumber) {
      return res.status(403).json({
        message: "Cannot confirm booking without a verified Driving License on record.",
      });
    }

    const updatedOrder = await BikeOrder.findByIdAndUpdate(
      req.params.orderId,
      { status, paymentId },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
});

export default router;
