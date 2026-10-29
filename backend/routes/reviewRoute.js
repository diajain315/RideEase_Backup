import express from "express";
import {
  addReview,
  getAllReviews,
  checkReviewEligibility,
} from "../controllers/reviewController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public endpoint to view all reviews
router.get("/all", getAllReviews);

// Check if authenticated user has rented a bike and can review
router.get("/can-review", requireSignIn, checkReviewEligibility);

// Only authenticated customers with confirmed rentals can submit reviews
router.post("/add", requireSignIn, addReview);

export default router;
