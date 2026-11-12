import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import en_US from "antd/locale/en_US";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "placeholder-client-id";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}>
    <ConfigProvider
      locale={en_US}
      theme={{
        token: {
          colorPrimary: "#10B981", // Electric Emerald
          colorLink: "#10B981",
          colorLinkHover: "#059669",
          borderRadius: 8,
          colorSuccess: "#10B981",
          colorWarning: "#F59E0B",
          colorError: "#EF4444",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "10px",
              background: "#0F172A",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
      </BrowserRouter>
    </ConfigProvider>
    </Provider>
  </GoogleOAuthProvider>
);

reportWebVitals();
