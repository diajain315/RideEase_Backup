import React, { useEffect, useState } from "react";
import Http from "./Http";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrivateSpinner from "./PrivateSpinner";

const Private = ({ children }) => {
  const { userToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }

    const authCheck = async () => {
      try {
        const res = await Http.get("/api/v1/auth/admin-auth");
        if (res.data?.ok) {
          setOk(true);
        } else {
          setOk(false);
          navigate("/");
        }
      } catch (error) {
        setOk(false);
        navigate("/login");
      }
    };

    authCheck();
  }, [userToken, navigate]);

  return ok ? <>{children}</> : <PrivateSpinner />;
};

export default Private;
