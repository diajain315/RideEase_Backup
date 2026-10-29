import Review from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";

/**
 * Add a new customer review.
 * Strictly enforces that only authenticated users who have rented at least
 * one vehicle can submit a review.
 */
export const addReview = async (req, res) => {
  try {
    const { name, message, rating } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be signed in to submit a review.",
      });
    }

    // Check if the user has at least one rental order
    const rentalCount = await orderModel.countDocuments({ renter: userId });
    if (rentalCount === 0) {
      return res.status(403).json({
        success: false,
        message: "Only customers who have rented a vehicle with RideEase can write a review.",
      });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid rating between 1 and 5 stars.",
      });
    }

    if (!message || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please write a feedback message of at least 5 characters.",
      });
    }

    const review = await Review.create({
      user: userId,
      name: name?.trim() || req.user.name || "Verified Customer",
      message: message.trim(),
      rating: Number(rating),
      isVerifiedRenter: true,
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your verified review has been submitted successfully.",
      review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

/**
 * Check review eligibility for the logged in user.
 * Returns whether user has completed a booking.
 */
export const checkReviewEligibility = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(200).json({
        canReview: false,
        reason: "AUTH_REQUIRED",
        message: "Please sign in to write a review.",
      });
    }

    const rentalCount = await orderModel.countDocuments({ renter: userId });
    if (rentalCount === 0) {
      return res.status(200).json({
        canReview: false,
        rentalCount: 0,
        reason: "NO_RENTALS",
        message: "Only customers who have rented a vehicle can submit a review.",
      });
    }

    return res.status(200).json({
      canReview: true,
      rentalCount,
      userName: req.user?.name || "",
      message: "Eligible to write a review.",
    });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Error checking review eligibility",
      error: error.message,
    });
  }
};

/**
 * Fetch all verified customer reviews.
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching reviews",
      error: error.message,
    });
  }
};
