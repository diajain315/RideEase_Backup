// components/ReviewSection.js
import React, { useEffect, useState } from "react";
//import axios from "axios";
import { Card, Rate } from "antd";
import Http from "../Helper/Http";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    Http.get("/api/v1/review/all").then((res) => {
      setReviews(res.data.reviews);
    });
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>What Our Customers Say</h2>
      {reviews.map((review) => (
        <Card key={review._id} style={{ marginBottom: "20px" }}>
          <Rate disabled defaultValue={review.rating} />
          <p><strong>{review.name}</strong></p>
          <p>{review.message}</p>
        </Card>
      ))}
    </div>
  );
};

export default ReviewSection;
