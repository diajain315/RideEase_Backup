import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import { ValidateEmailOnly } from "./ValidateEmail";
import { sendOtp } from "../redux/features/User/authAction";
import { clearFields } from "../redux/features/User/authSlice";
import Layout from "./Layout";
import Spinner from "../Helper/Spinner";
import Error from "../Helper/Error";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, userInfo, error } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (userInfo) {
      dispatch(clearFields());
      navigate("/");
    } else {
      dispatch(clearFields());
    }
  }, [userInfo, dispatch, navigate]);

  return (
    <Layout title="RideEase : Forgot Password">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reset Your Password
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email address to receive a verification OTP
            </p>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={ValidateEmailOnly}
            onSubmit={async (values) => {
              try {
                const result = await dispatch(sendOtp({ email: values.email }));
                if (!result.error) {
                  localStorage.setItem("resetEmail", values.email);
                  navigate("/sendOtp");
                }
              } catch (err) {
                console.error("Error sending OTP:", err);
              }
            }}
          >
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit} className="space-y-4">
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
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formikProps.values.email}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="email" />
                  </span>
                </div>

                {error && <Error>{error}</Error>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                  {loading ? <Spinner /> : "Send Verification OTP"}
                </button>
              </form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Remembered your password?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                Back to Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
