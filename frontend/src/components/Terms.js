import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Upload,
  message,
  Card,
  Typography,
  Divider,
  Input,
} from "antd";
import { UploadOutlined, CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faShieldHalved,
  faCreditCard,
  faIdCard,
  faCheckCircle,
  faGasPump,
  faHelmetSafety,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addLicense } from "../redux/features/User/authAction";
import Http from "../Helper/Http";

const { Title, Text, Paragraph } = Typography;

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [agreed, setAgreed] = useState(false);
  const [fileList, setFileList] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseError, setLicenseError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isChangingLicense, setIsChangingLicense] = useState(false);

  // Check if current user already has a verified license on record
  const currentUser =
    userInfo ||
    (localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null);
  const hasExistingLicense = Boolean(currentUser?.licenseNumber);

  // 🔍 Driving License Verification State
  const [docVerifying, setDocVerifying] = useState(false);
  const [docVerification, setDocVerification] = useState(null);

  const price = location.state?.totalAmount || 100;

  const validateLicense = (license) => {
    const clean = (license || "").trim().replace(/\s+/g, "");
    return clean.length >= 8 && clean.length <= 18;
  };

  const beforeUpload = async (file) => {
    const isAllowed =
      file.type.startsWith("image/") || file.type === "application/pdf";
    if (!isAllowed) {
      message.error("Only image files or PDFs are allowed!");
      return Upload.LIST_IGNORE;
    }
    setFileList(file);
    setDocVerification(null);

    // If image, trigger instant verification pre-check
    if (file.type.startsWith("image/")) {
      setDocVerifying(true);
      try {
        const testFormData = new FormData();
        testFormData.append("licenseFile", file);
        if (licenseNumber) {
          testFormData.append("licenseNumber", licenseNumber);
        }
        const res = await Http.post("/api/v1/auth/verify-license-doc", testFormData);
        if (res.data?.isValid) {
          setDocVerification({
            isValid: true,
            message: res.data.reason || "Official Driving License document verified successfully!",
          });
          message.success("Driving License verified successfully!");
        } else {
          setDocVerification({
            isValid: false,
            message:
              res.data?.reason ||
              "Uploaded image does not appear to be an official Driving License. Please upload a clear photo of your Driving License card.",
          });
          message.error("Document check failed: Not a recognized Driving License!");
        }
      } catch (err) {
        const errMsg =
          err.response?.data?.message ||
          "Could not verify document. Please ensure the image is clear and legible.";
        setDocVerification({
          isValid: false,
          message: errMsg,
        });
        message.error(errMsg);
      } finally {
        setDocVerifying(false);
      }
    } else {
      setDocVerification({
        isValid: true,
        message: "PDF document selected.",
      });
    }

    return false;
  };

  const checkoutHandler = async (amount) => {
    if (!hasExistingLicense || isChangingLicense) {
      if (!fileList || !licenseNumber) {
        message.error("You must enter your license number and upload a valid Driving License before paying.");
        return;
      }
      if (docVerification && !docVerification.isValid) {
        message.error("Uploaded document does not appear to be an official Driving License. Please upload a clear photo of your Driving License.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (!currentUser) {
        message.error("Please login to proceed with booking.");
        navigate("/login");
        return;
      }

      if (fileList && licenseNumber) {
        const licenseData = new FormData();
        licenseData.append("userId", currentUser._id);
        licenseData.append("licenseNumber", licenseNumber);
        licenseData.append("licenseFile", fileList);
        const licenseRes = await dispatch(addLicense(licenseData));
        if (licenseRes.error) {
          message.error(licenseRes.payload || "Driving license verification failed.");
          setSubmitting(false);
          return; // 🛑 DO NOT PROCEED TO PAYMENT IF LICENSE REJECTED
        }

        // Update local session
        const updatedUser = { ...currentUser, licenseNumber };
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      }

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
      message.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
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
            1. Vehicle Selected
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-sm">
            2. License & Terms
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
              Terms & License Verification
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Please verify your driving license and accept rental conditions before proceeding to secure payment.
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

          {/* Driving License Section */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Driver Identification & License
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                KYC Mandatory
              </span>
            </div>

            {hasExistingLicense && !isChangingLicense ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircleFilled className="text-emerald-600 text-xl shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Verified Driving License on Record
                    </span>
                    <span className="font-mono text-sm font-bold text-emerald-950">
                      {currentUser.licenseNumber}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingLicense(true);
                    setLicenseNumber(currentUser.licenseNumber || "");
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer shrink-0"
                >
                  Change / Upload New
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {isChangingLicense && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingLicense(false);
                        setFileList(null);
                        setDocVerification(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                    >
                      Use existing license on file ({currentUser.licenseNumber})
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Driving License Number *
                  </label>
                  <Input
                    placeholder="e.g. RJ27-20210012345"
                    size="large"
                    className="rounded-xl"
                    value={licenseNumber}
                    onChange={(e) => {
                      setLicenseNumber(e.target.value);
                      setLicenseError(!validateLicense(e.target.value));
                    }}
                  />
                  {licenseError && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">
                      Please enter a valid driving license number (8–18 characters).
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Upload License Document (Photo or PDF) *
                  </label>
                  <Upload
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    accept="image/*,.pdf"
                    className="w-full"
                    showUploadList={false}
                  >
                    <button
                      type="button"
                      className="w-full py-3 px-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-white text-slate-600 font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <UploadOutlined className="text-emerald-600 text-base" />
                      <span>{fileList ? fileList.name : "Click to select Driving License file"}</span>
                    </button>
                  </Upload>

                  {/* Real-time Document Verification Feedback */}
                  {docVerifying && (
                    <div className="mt-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2 font-medium">
                      <LoadingOutlined className="text-blue-600 text-sm animate-spin" />
                      <span>Scanning & verifying Driving License authenticity...</span>
                    </div>
                  )}

                  {docVerification && docVerification.isValid && (
                    <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 font-medium">
                      <CheckCircleFilled className="text-emerald-600 text-sm mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block">Document Verified:</span>
                        <span>{docVerification.message}</span>
                      </div>
                    </div>
                  )}

                  {docVerification && !docVerification.isValid && (
                    <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 font-medium">
                      <CloseCircleFilled className="text-rose-600 text-sm mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block">Document Check Failed:</span>
                        <span>{docVerification.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Terms Checklist */}
          <div className="space-y-3 mb-8 text-xs text-slate-600 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
            <p className="font-bold text-slate-800 text-sm">Summary of Terms:</p>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Renter must be at least 18 years old and hold a valid motor vehicle license.</li>
              <li>Vehicles must not be driven outside authorized jurisdiction without written consent.</li>
              <li>Traffic violations and fines incurred during the rental period are the renter's liability.</li>
              <li>Refundable security deposit is processed upon safe return inspection.</li>
            </ul>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-8 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <Checkbox
              onChange={(e) => setAgreed(e.target.checked)}
              checked={agreed}
              className="text-slate-800 font-semibold"
            >
              I have read, understood, and accept RideEase Rental Terms & Conditions.
            </Checkbox>
          </div>

          {/* Payment CTA */}
          {(() => {
            const isLicenseReady =
              (hasExistingLicense && !isChangingLicense) ||
              (fileList && licenseNumber && !licenseError && (!docVerification || docVerification.isValid));
            const isDisabled =
              !agreed ||
              submitting ||
              docVerifying ||
              !isLicenseReady ||
              (docVerification && !docVerification.isValid);

            return (
              <button
                type="button"
                onClick={() => checkoutHandler(price)}
                disabled={isDisabled}
                className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  !isDisabled
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FontAwesomeIcon icon={faCreditCard} />
                <span>
                  {submitting
                    ? "Connecting to Payment Gateway..."
                    : `Proceed to Pay ₹${price}`}
                </span>
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
