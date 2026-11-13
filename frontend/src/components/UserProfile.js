import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import Error from "../Helper/Error";
import Layout from "./Layout";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faSave,
  faListCheck,
  faCheckCircle,
  faIdCard,
  faCloudArrowUp,
  faCircleExclamation,
  faSpinner,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { LoggedInUser, editUserById, addLicense } from "../redux/features/User/authAction";
import Http from "../Helper/Http";
import * as Yup from "yup";

export const ValidateProfile = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[a-zA-Z\s.]+$/,
      "Name can only contain alphabetical characters, spaces, and periods."
    )
    .min(3, "Name must be at least 3 characters long.")
    .max(50, "Name cannot be longer than 50 characters.")
    .required("*Name is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid Indian phone number")
    .required("Phone number is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Select a valid gender")
    .required("Gender is required"),
});

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [profileError, setProfileError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    gender: ""
  });

  // Driving License Upload & Update State
  const [selectedLicenseFile, setSelectedLicenseFile] = useState(null);
  const [licenseUploading, setLicenseUploading] = useState(false);
  const [licenseError, setLicenseError] = useState("");
  const [licenseSuccess, setLicenseSuccess] = useState("");
  const [viewingDoc, setViewingDoc] = useState(false);
  const licenseInputRef = useRef(null);
  const isOnboardingRef = useRef(false);

  useEffect(() => {
    if (
      location.state?.requiredProfileCompletion ||
      (userInfo &&
        userInfo.role !== 1 &&
        (!userInfo.phone || userInfo.phone.trim() === "" || !userInfo.gender || userInfo.gender.trim() === ""))
    ) {
      isOnboardingRef.current = true;
    }
  }, [userInfo, location.state]);

  const isProfileCompletion =
    isOnboardingRef.current ||
    Boolean(location.state?.requiredProfileCompletion) ||
    Boolean(
      userInfo &&
        userInfo.role !== 1 &&
        (!userInfo.phone || userInfo.phone.trim() === "" || !userInfo.gender || userInfo.gender.trim() === "")
    );

  // Fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(LoggedInUser());
  }, [dispatch, navigate]);

  // Update local form values whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormValues({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        gender: userInfo.gender || "",
      });
    }
  }, [userInfo]);

  // Success message timeout
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  // License success message timeout
  useEffect(() => {
    if (licenseSuccess) {
      const timer = setTimeout(() => {
        setLicenseSuccess("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [licenseSuccess]);

  // Handle form submission
  const handleSubmit = async (values, actions) => {
    const updateData = {
      name: values.name,
      phone: values.phone,
      gender: values.gender,
    };
    let data = {
      id: userInfo._id,
      formdata: updateData,
    };
    try {
      await dispatch(editUserById(data));
      setUpdateSuccess(true);
      setProfileError("");
      const userRes = await dispatch(LoggedInUser());
      const updatedUser = userRes?.payload?.user || userRes?.payload || userInfo;
      const hasLicense = Boolean(
        updatedUser?.hasLicense ??
        updatedUser?.licenseNumber ??
        userInfo?.hasLicense
      );

      const returnFrom = location.state?.from;
      const orderData = location.state?.orderData;

      if (isProfileCompletion) {
        if (!hasLicense && userInfo?.role !== 1) {
          setTimeout(() => {
            navigate("/upload-license", {
              state: { from: returnFrom, orderData },
              replace: true,
            });
          }, 1200);
        } else {
          setTimeout(() => {
            navigate(returnFrom || "/", {
              state: orderData,
              replace: true,
            });
          }, 1200);
        }
      }
    } catch (error) {
      setProfileError(error?.message || "Update failed. Please try again.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Handle license file change
  const handleLicenseChange = (e) => {
    setLicenseError("");
    setLicenseSuccess("");
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validExtensions = /\.(pdf|jpe?g|png|webp)$/i;
    const validMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!validMimes.includes(file.type) && !file.name.match(validExtensions)) {
      setLicenseError("Please select a valid Driving License PDF or Image (JPG, PNG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setLicenseError("File size must be under 10 MB.");
      return;
    }

    setSelectedLicenseFile(file);
  };

  // Handle license document upload/update
  const handleLicenseUpload = async (e) => {
    e.preventDefault();
    if (!selectedLicenseFile) {
      setLicenseError("Please select a file to upload.");
      return;
    }

    try {
      setLicenseUploading(true);
      setLicenseError("");
      const formData = new FormData();
      if (userInfo?._id) {
        formData.append("userId", userInfo._id);
      }
      formData.append("licenseFile", selectedLicenseFile);

      const res = await dispatch(addLicense(formData));

      if (res.error) {
        setLicenseError(
          res.payload ||
            "Failed to verify Driving License. Please ensure you upload an authentic Driving License PDF or clear photo."
        );
        return;
      }

      setLicenseSuccess("Driving License updated and verified successfully!");
      setSelectedLicenseFile(null);
      if (licenseInputRef.current) {
        licenseInputRef.current.value = "";
      }
      dispatch(LoggedInUser());
    } catch (err) {
      setLicenseError(err?.message || "Failed to update license.");
    } finally {
      setLicenseUploading(false);
    }
  };

  // Handle viewing existing uploaded license document
  const handleViewDocument = async () => {
    if (!userInfo?._id) return;
    try {
      setViewingDoc(true);
      setLicenseError("");
      const res = await Http.get(`/api/v1/auth/user-license/${userInfo._id}`, {
        responseType: "blob",
      });
      const contentType = res.headers["content-type"] || "application/pdf";
      const blob = new Blob([res.data], { type: contentType });
      const docUrl = window.URL.createObjectURL(blob);
      window.open(docUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setLicenseError(
        err?.response?.data?.message ||
          "Could not load license document. You can upload an updated document below."
      );
    } finally {
      setViewingDoc(false);
    }
  };

  if (loading || !userInfo) {
    return (
      <Layout title="RideEase : Profile Loading">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-slate-50">
          <Loading fullScreen={false} message="Loading your profile..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="RideEase : User Profile">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl font-bold shadow-sm mb-3">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Profile
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isProfileCompletion ? "Complete your contact details to continue" : "Manage your account details and preferences"}
            </p>
          </div>

          {isProfileCompletion && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-amber-600" />
                Complete Account Details
              </div>
              <p>
                Please enter your 10-digit mobile number and select your gender to complete your profile before proceeding.
              </p>
            </div>
          )}

          {updateSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
              {isProfileCompletion
                ? (!userInfo?.hasLicense && userInfo?.role !== 1
                  ? "Profile details saved! Proceeding to Driving License verification..."
                  : "Profile updated successfully! Redirecting...")
                : "Profile updated successfully!"}
            </div>
          )}

          <Formik
            enableReinitialize={true}
            initialValues={formValues}
            validationSchema={ValidateProfile}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.name}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="name" />
                  </span>
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Email Address
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Read-only</span>
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={props.values.email}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-100/80 text-slate-500 cursor-not-allowed font-medium"
                      disabled
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      autoComplete="tel"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.phone}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="phone" />
                  </span>
                </div>

                {/* Gender Radio Buttons */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["male", "female", "other"].map((g) => (
                      <label
                        key={g}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold capitalize cursor-pointer transition-all ${
                          props.values.gender === g
                            ? "border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-1 ring-emerald-500"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          checked={props.values.gender === g}
                          className="accent-emerald-600"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="gender" />
                  </span>
                </div>

                {profileError && <Error>{profileError}</Error>}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    disabled={props.isSubmitting}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {props.isSubmitting
                      ? "Saving..."
                      : isProfileCompletion
                      ? "Save & Continue"
                      : "Save Changes"}
                  </button>
                  
                  {!isProfileCompletion && (
                    <Link
                      to="/orderdropdown"
                      className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faListCheck} />
                      My Bookings
                    </Link>
                  )}
                </div>
              </form>
            )}
          </Formik>

          {/* 🪪 Driving License / KYC Verification Section (Hidden during profile completion) */}
          {!isProfileCompletion && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faIdCard} className="text-emerald-600 text-base" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Driving License (KYC)
                  </h3>
                </div>
                {userInfo?.hasLicense ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <FontAwesomeIcon icon={faCheckCircle} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Action Required
                  </span>
                )}
              </div>

              {userInfo?.hasLicense ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-lg shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        Official Driving License on file
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Eligible for all vehicle bookings
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleViewDocument}
                    disabled={viewingDoc}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60 shrink-0"
                  >
                    {viewingDoc ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                        <span>Opening...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faEye} className="text-xs" />
                        <span>View Current Document</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
                  You haven't uploaded your Driving License yet. Upload your document (PDF or Photo) to rent bikes.
                </div>
              )}

              {licenseSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                  {licenseSuccess}
                </div>
              )}

              {licenseError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleExclamation} className="text-rose-500" />
                  {licenseError}
                </div>
              )}

              {/* Update License Form */}
              <form onSubmit={handleLicenseUpload} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    {userInfo?.hasLicense ? "Update License Document (PDF / Photo)" : "Upload License Document (PDF / Photo)"}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      ref={licenseInputRef}
                      type="file"
                      accept=".pdf,image/jpeg,image/png,image/webp"
                      onChange={handleLicenseChange}
                      className="flex-1 text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl bg-slate-50/50 p-1"
                    />
                    <button
                      type="submit"
                      disabled={licenseUploading || !selectedLicenseFile}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    >
                      {licenseUploading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCloudArrowUp} />
                          <span>{userInfo?.hasLicense ? "Update Document" : "Upload Document"}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports DigiLocker / Parivahan PDF, JPG, PNG up to 10 MB.
                  </p>
                </div>
              </form>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link 
              to="/" 
              className="text-xs text-slate-500 hover:text-emerald-600 font-medium transition-colors"
            >
              ← Back to Fleet & Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
