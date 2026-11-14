import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Checkbox,
  message,
} from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faShieldHalved,
  faCreditCard,
  faIdCard,
  faGasPump,
  faHelmetSafety,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Http from "../Helper/Http";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Terms() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelHold = async () => {
    const orderId = location.state?.orderId;
    if (orderId) {
      try {
        setCancelling(true);
        await Http.delete(`/api/v1/order/cancel-hold/${orderId}`);
        message.success("Booking hold cancelled and dates unlocked.");
      } catch (e) {
        console.warn("Could not cancel hold:", e);
      } finally {
        setCancelling(false);
      }
    }
    navigate(-1);
  };

  const currentUser =
    userInfo ||
    (localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null);

  const price = location.state?.totalAmount || 100;

  // 🛑 Glitch fallback: Ensure user is logged in & has verified license
  useEffect(() => {
    if (!currentUser) {
      message.error("Please login to proceed with booking.");
      navigate("/login", {
        replace: true,
        state: { from: "/Terms", orderData: location.state },
      });
      return;
    }

    if (!currentUser.hasLicense && currentUser.role !== 1) {
      message.warning("Please upload your Driving License first to proceed.");
      navigate("/upload-license", {
        replace: true,
        state: { from: "/Terms", orderData: location.state },
      });
    }
  }, [currentUser, navigate, location.state]);

  const checkoutHandler = async (amount) => {
    if (!currentUser) {
      message.error("Please login to proceed with booking.");
      navigate("/login");
      return;
    }

    if (!currentUser.hasLicense && currentUser.role !== 1) {
      message.warning("Driving License verification required before payment.");
      navigate("/upload-license", {
        state: { from: "/Terms", orderData: location.state },
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: keyData } = await Http.get("/api/v1/getKey");
      const key = keyData?.key;

      if (!key) {
        message.error("Failed to retrieve Razorpay key. Please try again.");
        return;
      }

      const validAmount = Number(amount) || 100;
      const { data: orderData } = await Http.post("/api/v1/payment/process", {
        amount: validAmount,
      });

      if (!orderData || !orderData.order) {
        message.error("Failed to create payment order. Please try again.");
        return;
      }

      const { order } = orderData;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        message.error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "RideEase Rentals",
        description: "Vehicle Rental Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            if (location.state?.orderId && response.razorpay_payment_id) {
              await Http.post("/api/v1/order/razorpay-success", {
                orderId: location.state.orderId,
                paymentId: response.razorpay_payment_id,
              });
            }
          } catch (e) {
            console.error("Order status update failed:", e);
          }
          window.location.href = "/payment-success";
        },
        prefill: {
          name: currentUser.name || "Customer",
          email: currentUser.email || "customer@example.com",
          contact: currentUser.phone || "",
        },
        theme: {
          color: "#10B981", // Electric Emerald
        },
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed", function (response) {
        message.error(response.error?.description || "Payment failed");
      });
      razor.open();
    } catch (err) {
      console.error("Payment setup error:", err.response || err);
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      message.error(errorMsg);

      if (err.response?.data?.noLicense) {
        navigate("/upload-license", {
          state: { from: "/Terms", orderData: location.state },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            1. Dates Selected
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-sm">
            2. Review & Payment
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400">
            3. Confirmation
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 sm:p-10">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 text-xl">
              <FontAwesomeIcon icon={faFileContract} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Review & Complete Booking
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Confirm your rental conditions and proceed to secure checkout.
            </p>
          </div>

          {/* Quick Rules Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium">
              <FontAwesomeIcon icon={faHelmetSafety} className="text-emerald-600 text-base" />
              <span>Complimentary helmets provided</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium">
              <FontAwesomeIcon icon={faGasPump} className="text-emerald-600 text-base" />
              <span>Full-to-full fuel policy</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600 text-base" />
              <span>Third-party insurance covered</span>
            </div>
          </div>

          {/* Driving License Verified Badge */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircleFilled className="text-emerald-600 text-2xl shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Verified Driving License on Account
                  </h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your KYC document is verified. No further documents required for checkout.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">
                KYC Complete
              </span>
            </div>
          </div>

          {/* Terms Checklist */}
          <div className="space-y-3 mb-8 text-xs text-slate-600 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
            <p className="font-bold text-slate-800 text-sm">Summary of Rental Terms:</p>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Renter must be at least 18 years old and hold a valid motor vehicle license.</li>
              <li>Vehicles must not be driven outside authorized jurisdiction without written consent.</li>
              <li>Traffic violations and fines incurred during the rental period are the renter's liability.</li>
              <li>Refundable security deposit is processed upon safe vehicle return inspection.</li>
            </ul>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-8 p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80">
            <Checkbox
              onChange={(e) => setAgreed(e.target.checked)}
              checked={agreed}
              className="text-slate-800 font-semibold"
            >
              I have read, understood, and accept RideEase Rental Terms & Conditions.
            </Checkbox>
          </div>

          {/* Payment CTA */}
          <button
            type="button"
            onClick={() => checkoutHandler(price)}
            disabled={!agreed || submitting}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              agreed && !submitting
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-base" />
                <span>Connecting to Payment Gateway...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCreditCard} />
                <span>Proceed to Pay ₹{price}</span>
              </>
            )}
          </button>

          {/* Cancel & Release Hold Action */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hold active for 15 mins</span>
            <button
              type="button"
              disabled={cancelling || submitting}
              onClick={handleCancelHold}
              className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
            >
              <span>{cancelling ? "Releasing dates..." : "Cancel Booking & Unlock Dates"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
