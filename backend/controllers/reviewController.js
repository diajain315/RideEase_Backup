// controllers/reviewController.js
import Review from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    const review = await Review.create({ name, message, rating });
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add review", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
