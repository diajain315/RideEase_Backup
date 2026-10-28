import React from "react";
import { Link } from "react-router-dom";
import AddReviewForm from "./ReviewForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faHome, faMotorcycle } from "@fortawesome/free-solid-svg-icons";

export default function PaymentSuccess() {
  return (
    <div className="bg-slate-50 min-h-screen py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Celebration Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-4xl mb-4">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Booking & Payment Confirmed!
          </h1>

          <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for booking with RideEase Udaipur! Your vehicle has been reserved. Our operations team will contact you shortly regarding pickup/delivery details.
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/bikerentsection"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <FontAwesomeIcon icon={faMotorcycle} />
              <span>Browse More Bikes</span>
            </Link>
          </div>
        </div>

        {/* Review Invitation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Share Your Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your feedback helps fellow travelers choose the right ride in Udaipur.
            </p>
          </div>
          <AddReviewForm />
        </div>
      </div>
    </div>
  );
}
