import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { userRegister } from "../redux/features/User/authAction";
import { Formik, ErrorMessage } from "formik";
import { ValidateUser } from "../common/Validation";
import { clearFields } from "../redux/features/User/authSlice";
import Error from "../Helper/Error";
import Layout from "./Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser, faPhone, faEnvelope, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (success) {
      dispatch(clearFields());
      navigate("/login");
    }
  }, [success, dispatch, navigate]);

  return (
    <Layout title={"RideEase : Create Account"}>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Join RideEase to rent bikes with verified confidence
            </p>
          </div>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              gender: "",
            }}
            validationSchema={ValidateUser}
            onSubmit={async (values, actions) => {
              const data = await dispatch(userRegister(values));
              if (data.error) {
                setErrors(data.payload);
                dispatch(clearFields());
              }
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="space-y-4">
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
                      value={props.values.name || ""}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="name" />
                  </span>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email || ""}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="email" />
                  </span>
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
                      value={props.values.phone || ""}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="phone" />
                  </span>
                </div>

                {/* Password Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faKey}
                        className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                      />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.password || ""}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <span className="text-red-500 text-xs mt-1 block">
                      <ErrorMessage name="password" />
                    </span>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faKey}
                        className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                      />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.confirmPassword || ""}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <span className="text-red-500 text-xs mt-1 block">
                      <ErrorMessage name="confirmPassword" />
                    </span>
                  </div>
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

                {errors && <Error>{errors}</Error>}

                <button
                  type="submit"
                  className="w-full py-3 px-4 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  disabled={props.isSubmitting}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  {props.isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
