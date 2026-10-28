import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";

const PrivateSpinner = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    if (count === 0) {
      navigate("/login", { state: { from: location.pathname } });
    }
    return () => clearInterval(interval);
  }, [count, navigate, location]);

  return (
    <Loading
      fullScreen={true}
      message={`Verifying authentication... Redirecting in ${count}s`}
    />
  );
};

export default PrivateSpinner;
