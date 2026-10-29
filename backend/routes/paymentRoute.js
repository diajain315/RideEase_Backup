import express from "express";
import { getKey, processPayment } from "../controllers/paymentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected: Only authenticated users with verified driving licenses can create payment transactions
router.route("/payment/process").post(requireSignIn, processPayment);
router.route("/getKey").get(getKey);

export default router;
