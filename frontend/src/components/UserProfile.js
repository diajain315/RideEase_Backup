import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import Error from "../Helper/Error";
import Layout from "./Layout";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faSave, faListCheck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { LoggedInUser, editUserById } from "../redux/features/User/authAction";
import * as Yup from "yup";

export const ValidateProfile = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[A-Za-z]+(?:\s[A-Za-z]+){0,1}$/,
      "Username can only contain alphabetical characters with one whitespace."
    )
    .min(3, "Username must be at least 3 characters long.")
    .max(15, "Username cannot be longer than 15 characters.")
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
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [profileError, setProfileError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    gender: ""
  });

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
      dispatch(LoggedInUser());
    } catch (error) {
      setProfileError(error?.message || "Update failed. Please try again.");
    } finally {
      actions.setSubmitting(false);
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
            <p className="text-xs text-slate-500 mt-1">Manage your account details and preferences</p>
          </div>

          {updateSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
              Profile updated successfully!
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
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    disabled={props.isSubmitting}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {props.isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                  
                  <Link
                    to="/orderdropdown"
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faListCheck} />
                    My Bookings
                  </Link>
                </div>
              </form>
            )}
          </Formik>

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
