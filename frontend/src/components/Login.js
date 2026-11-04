import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Helper/Spinner";
import { userLogin } from "../redux/features/User/authAction";
import { clearFields } from "../redux/features/User/authSlice";
import Layout from "./Layout";
import Error from "../Helper/Error";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, userInfo } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEmail("");
    setPassword("");
  }, []);

  useEffect(() => {
    if (userInfo) {
      dispatch(clearFields());
      const locationState = location.state;
      if (locationState?.from) {
        navigate(locationState.from, { state: locationState.orderData });
      } else if (userInfo.role === 1) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [userInfo, dispatch, navigate, location]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    const datas = await dispatch(userLogin(data));
    if (datas.error) {
      setErrors(datas.payload);
      dispatch(clearFields());
    }
  };

  return (
    <Layout title={"RideEase : Sign In"}>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10 transition-all">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage your rides and bookings
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
            {/* Hidden dummy fields to consume browser autofill */}
            <div
              style={{
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
                opacity: 0,
                width: 0,
                height: 0,
                overflow: "hidden",
              }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="fake_autofill_email"
                tabIndex="-1"
                autoComplete="username"
                readOnly
              />
              <input
                type="password"
                name="fake_autofill_pwd"
                tabIndex="-1"
                autoComplete="current-password"
                readOnly
              />
            </div>

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
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <Link
                  to="/sendOtp"
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faKey}
                  className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errors && <Error>{errors}</Error>}

            <button
              type="submit"
              className="w-full py-3 px-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Sign In"}
            </button>
          </form>

          {/* Create account section */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">
              Don't have an account yet?
            </p>
            <Link
              to="/signup"
              className="w-full py-2.5 px-4 text-xs font-semibold border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Create New Account</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
