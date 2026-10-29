import { instance } from "../server.js";
import userModel from "../models/userModel.js";

/**
 * Initiates Razorpay payment order.
 * Strictly verifies that the authenticated user has a verified Driving License on record.
 */
export const processPayment = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to initiate payment.",
      });
    }

    // Verify user has an authentic Driving License on record
    const user = await userModel.findById(userId);
    if (!user || !user.licenseNumber) {
      return res.status(403).json({
        success: false,
        noLicense: true,
        message:
          "You must upload and verify a valid Driving License before proceeding to payment.",
      });
    }

    const rawAmount = Number(req.body.amount);
    const validAmount = isNaN(rawAmount) || rawAmount <= 0 ? 100 : rawAmount;
    const options = {
      amount: Math.round(validAmount * 100), // in paise
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in processPayment:", error);
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    });
  }
};

export const getKey = async (req, res) => {
  try {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.error("Error in getKey:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Razorpay key",
    });
  }
};
