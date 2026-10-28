import React, { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FloatButton } from "antd";
import Loading from "./components/Loading";
import Private from "./Helper/Private";
import Http from "./Helper/Http";
import { logout } from "./redux/features/User/authSlice";
import "./App.css";

// Lazy Load Major Components
const App1 = lazy(() => import("./components/App1"));
const Dashboard = lazy(() => import("./dashboard/Dashboard"));

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkServerSession = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const res = await Http.get("/api/v1/auth/server-instance");
        const currentInstanceId = res.data?.instanceId;
        const savedInstanceId = localStorage.getItem("serverInstanceId");

        if (currentInstanceId && savedInstanceId !== currentInstanceId) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("userId");
          localStorage.removeItem("serverInstanceId");
          sessionStorage.clear();
          dispatch(logout());
        }
      } catch (err) {
        console.warn("Server instance validation skipped:", err?.message);
      }
    };

    checkServerSession();
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-slate-50 min-h-screen">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/*" element={<App1 />} />
              <Route path="/admin/*" element={<Private><Dashboard /></Private>} />
            </Routes>
          </Suspense>
          <FloatButton.BackTop type="primary" visibilityHeight={50} />
        </div>
      )}
    </>
  );
}

export default App;
