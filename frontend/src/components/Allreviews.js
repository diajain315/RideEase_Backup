import React, { useEffect, useState } from "react";
//import axios from "axios";
import Http from "../Helper/Http";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    Http.get("/api/v1/review/all")
      .then((res) => {
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching reviews:", err);
      });
  }, []);

  return (
    <div>
      <h2>Customer Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Rating:</strong> {review.rating} ⭐</p>
            <p><strong>Name:</strong> {review.name}</p>
            <p><strong>Review:</strong> {review.message || review.comment}</p>
            <p><em>{new Date(review.createdAt || review.date).toLocaleString()}</em></p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default AllReviews;
