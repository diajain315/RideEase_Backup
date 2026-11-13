import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addLicense } from "../redux/features/User/authAction";
import Layout from "./Layout";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faCloudArrowUp,
  faFilePdf,
  faFileImage,
  faCheckCircle,
  faShieldHalved,
  faCircleExclamation,
  faSpinner,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const UploadLicense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;
    const validExtensions = /\.(pdf|jpe?g|png|webp)$/i;
    const validMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!validMimes.includes(file.type) && !file.name.match(validExtensions)) {
      setError("Please upload a valid Driving License PDF or Image (JPG, PNG).");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10 MB.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select your Driving License file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      if (userInfo?._id) {
        formData.append("userId", userInfo._id);
      }
      formData.append("licenseFile", selectedFile);

      const res = await dispatch(addLicense(formData));

      if (res.error) {
        const errorMsg =
          res.payload ||
          "Failed to verify Driving License document. Please ensure it is a clear photo or official PDF.";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setSuccess(true);
      toast.success("Driving License verified and uploaded successfully!");

      const returnUrl = location.state?.from || "/";
      const orderData = location.state?.orderData;

      setTimeout(() => {
        if (returnUrl) {
          navigate(returnUrl, { state: orderData, replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1200);
    } catch (err) {
      const msg = err?.message || "Failed to upload license. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isPdf = selectedFile?.type === "application/pdf" || selectedFile?.name?.toLowerCase().endsWith(".pdf");

  return (
    <Layout title="RideEase : Upload Driving License">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 text-2xl shadow-sm">
              <FontAwesomeIcon icon={faIdCard} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Driving License Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              To rent vehicles on RideEase, please upload your official Driving License document (DigiLocker/Parivahan PDF or clear photo).
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-600 text-xs mb-6">
            <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600 text-sm shrink-0" />
            <span>Encrypted KYC storage. Verified safely for vehicle rental compliance only.</span>
          </div>

          {success ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-4xl" />
              <h3 className="text-lg font-bold text-emerald-900">License Verified Successfully!</h3>
              <p className="text-xs text-emerald-700">
                Your driving license has been saved to your account. Redirecting you...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50/50"
                    : selectedFile
                    ? "border-emerald-400 bg-emerald-50/20"
                    : "border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-2xl">
                      <FontAwesomeIcon icon={isPdf ? faFilePdf : faFileImage} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to change file
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <FontAwesomeIcon icon={faCheckCircle} /> Ready to verify
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 text-2xl">
                      <FontAwesomeIcon icon={faCloudArrowUp} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        DigiLocker / Parivahan PDF, or clear JPG / PNG (Max 10 MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2">
                  <FontAwesomeIcon icon={faCircleExclamation} className="text-rose-500 text-sm mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Verifying Document with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Upload License</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-emerald-600 font-medium transition-colors"
            >
              ← Skip for now and explore bikes
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadLicense;
