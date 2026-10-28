import React, { useEffect, useState } from "react";
import Http from "../Helper/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faStar, faQuoteLeft, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Carousel, Modal } from "antd";
import ReviewForm from "./ReviewForm";

export default function Testimonial() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await Http.get("/api/v1/review/all");
        if (res.data?.success) {
          setReviews(res.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const chunkReviews = (arr, chunkSize) => {
    if (!arr.length || chunkSize < 1) return [];
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const reviewChunks = chunkReviews(reviews, Math.ceil(reviews.length / 3));

  return (
    <section className="bg-slate-50 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Rider Stories
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Loved by Travelers in Udaipur
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic reviews from tourists, couples, and road-trippers who rented with RideEase.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-bold shadow-xs transition-all shrink-0"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="text-emerald-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {reviewChunks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewChunks.map((chunk, chunkIndex) => (
              <Carousel
                autoplay
                key={chunkIndex}
                className="w-full"
                dots={{ className: "!bottom-[-16px]" }}
              >
                {chunk.map((review, index) => (
                  <div key={index} className="p-1">
                    <div className="h-full flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={`text-xs ${
                                i < review.rating
                                  ? "text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Quote icon & text */}
                        <div className="relative mb-5">
                          <FontAwesomeIcon
                            icon={faQuoteLeft}
                            className="text-slate-200 text-xl absolute -top-2.5 -left-1 opacity-70"
                          />
                          <p className="relative z-10 text-slate-700 text-xs sm:text-sm leading-relaxed italic pl-5">
                            "{review.message}"
                          </p>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {review.name ? review.name.charAt(0).toUpperCase() : "R"}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 leading-tight">
                            {review.name}
                          </p>
                          <p className="text-[11px] text-slate-400">Verified Rider</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FontAwesomeIcon icon={faComments} className="text-3xl text-emerald-500 mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No reviews yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first to share your experience exploring Udaipur with RideEase!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
            >
              Write First Review
            </button>
          </div>
        )}

        {/* Modal for Submitting a Review */}
        <Modal
          title={<span className="font-bold text-slate-900">Share Your Experience</span>}
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
        >
          <div className="pt-2">
            <ReviewForm />
          </div>
        </Modal>
      </div>
    </section>
  );
}
