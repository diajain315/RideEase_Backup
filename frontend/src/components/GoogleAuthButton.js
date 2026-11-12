import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { googleLogin } from "../redux/features/User/authAction";

const isGoogleConfigured = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return Boolean(clientId && clientId !== "placeholder-client-id" && clientId.trim() !== "");
};

/**
 * Reusable "Continue with Google" OAuth button shared by Login and Signup screens.
 */
const GoogleAuthButton = ({ label = "Continue with Google", onError }) => {
  const dispatch = useDispatch();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        await dispatch(googleLogin({ accessToken: tokenResponse.access_token })).unwrap();
        toast.success("Signed in with Google!");
      } catch (err) {
        const message = typeof err === "string" ? err : err?.message || "Google sign-in failed";
        onError?.(message);
        toast.error(message);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      const message = "Google sign-in was cancelled or failed.";
      onError?.(message);
      toast.error(message);
      setGoogleLoading(false);
    },
  });

  const handleClick = () => {
    if (!isGoogleConfigured()) {
      const message =
        "Google Sign-In is not configured yet. Add REACT_APP_GOOGLE_CLIENT_ID in frontend/.env and GOOGLE_CLIENT_ID in backend/.env.";
      onError?.(message);
      toast.error(message);
      return;
    }
    onError?.("");
    handleGoogleLogin();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={googleLoading}
      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-60"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
        />
      </svg>
      <span>{googleLoading ? "Connecting to Google..." : label}</span>
    </button>
  );
};

export default GoogleAuthButton;
